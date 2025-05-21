
import React, { useState, useEffect } from "react";
import { Company, Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CompanyItem from "./CompanyItem";
import { supabase } from "@/integrations/supabase/client";

const CompanyForm: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar empresas do Supabase quando o componente for montado
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // Buscar todas as empresas
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('id, name, description, created_at');
        
        if (companiesError) throw companiesError;
        
        // Para cada empresa, buscar seus setores
        const companiesWithSectors = await Promise.all(companiesData.map(async (company) => {
          // Buscar setores da empresa
          const { data: sectorsData, error: sectorsError } = await supabase
            .from('sectors')
            .select('id, name, description, when_to_transfer, responsible_person')
            .eq('company_id', company.id);
          
          if (sectorsError) throw sectorsError;
          
          // Para cada setor, buscar seus campos
          const sectorsWithFields = await Promise.all(sectorsData.map(async (sector) => {
            // Buscar campos do setor
            const { data: fieldsData, error: fieldsError } = await supabase
              .from('sector_fields')
              .select('id, field_name')
              .eq('sector_id', sector.id);
            
            if (fieldsError) throw fieldsError;
            
            // Converter o formato do banco para o formato da aplicação
            const formattedFields: SectorField[] = fieldsData.map(field => ({
              id: field.id,
              name: field.field_name
            }));
            
            // Retornar o setor com seus campos
            return {
              id: sector.id,
              name: sector.name,
              description: sector.description,
              whenToTransfer: sector.when_to_transfer,
              responsiblePerson: sector.responsible_person,
              fields: formattedFields
            } as Sector;
          }));
          
          // Retornar a empresa com seus setores
          return {
            id: company.id,
            name: company.name,
            description: company.description,
            sectors: sectorsWithFields
          } as Company;
        }));
        
        setCompanies(companiesWithSectors);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar as empresas e setores.",
          variant: "destructive",
        });
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [toast]);

  const addCompany = () => {
    const newCompany: Company = {
      id: `company-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      description: "",
      sectors: [],
    };
    
    setCompanies([...companies, newCompany]);
  };

  const updateCompany = (id: string, updatedCompany: Partial<Company>) => {
    setCompanies(
      companies.map((company) =>
        company.id === id ? { ...company, ...updatedCompany } : company
      )
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const isValid = companies.every(
      (company) => 
        company.name.trim() !== "" && 
        company.sectors.every((sector) => 
          sector.name.trim() !== "" && 
          sector.description.trim() !== "" &&
          sector.responsiblePerson.trim() !== ""
        )
    );
    
    if (!isValid) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios (nome da empresa, nome do setor, descrição do setor e responsável).",
        variant: "destructive",
      });
      return;
    }
    
    if (companies.length === 0) {
      toast({
        title: "Nenhuma empresa",
        description: "Adicione pelo menos uma empresa ao formulário.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Salvar cada empresa e seus dados relacionados
      for (const company of companies) {
        // Verificar se a empresa já existe (tem UUID válido do banco)
        const isNewCompany = company.id.startsWith('company-');
        
        let companyId = company.id;
        
        // Se for uma nova empresa, inserir no banco
        if (isNewCompany) {
          const { data, error } = await supabase
            .from('companies')
            .insert({
              name: company.name,
              description: company.description,
            })
            .select('id')
            .single();
          
          if (error) throw error;
          companyId = data.id;
        } else {
          // Atualizar empresa existente
          const { error } = await supabase
            .from('companies')
            .update({
              name: company.name,
              description: company.description,
            })
            .eq('id', company.id);
          
          if (error) throw error;
        }
        
        // Processar cada setor da empresa
        for (const sector of company.sectors) {
          const isNewSector = sector.id.startsWith('sector-');
          let sectorId = sector.id;
          
          // Se for um novo setor, inserir no banco
          if (isNewSector) {
            const { data, error } = await supabase
              .from('sectors')
              .insert({
                company_id: companyId,
                name: sector.name,
                description: sector.description,
                when_to_transfer: sector.whenToTransfer,
                responsible_person: sector.responsiblePerson,
              })
              .select('id')
              .single();
            
            if (error) throw error;
            sectorId = data.id;
          } else {
            // Atualizar setor existente
            const { error } = await supabase
              .from('sectors')
              .update({
                company_id: companyId,
                name: sector.name,
                description: sector.description,
                when_to_transfer: sector.whenToTransfer,
                responsible_person: sector.responsiblePerson,
              })
              .eq('id', sector.id);
            
            if (error) throw error;
            
            // Apagar campos existentes para reinseri-los (mais simples que comparar e atualizar)
            await supabase
              .from('sector_fields')
              .delete()
              .eq('sector_id', sectorId);
          }
          
          // Inserir todos os campos do setor
          if (sector.fields && sector.fields.length > 0) {
            const fieldsToInsert = sector.fields.map(field => ({
              sector_id: sectorId,
              field_name: field.name,
            }));
            
            const { error } = await supabase
              .from('sector_fields')
              .insert(fieldsToInsert);
            
            if (error) throw error;
          }
        }
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: `${companies.length} empresas e ${companies.reduce(
          (total, company) => total + company.sectors.length,
          0
        )} setores registrados com sucesso!`,
      });
      
      // Recarregar os dados para ter os IDs atualizados
      window.location.reload();
      
    } catch (error: any) {
      toast({
        title: "Erro ao salvar dados",
        description: error.message || "Não foi possível salvar os dados no servidor.",
        variant: "destructive",
      });
      console.error("Erro ao salvar dados:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-800">
            Empresas e Setores
          </h2>
          <Button
            type="button"
            onClick={addCompany}
            className="flex items-center bg-blue-600 hover:bg-blue-700"
            disabled={loading || saving}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Empresa
          </Button>
        </div>
        
        {loading ? (
          <Card className="p-8">
            <CardContent className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Carregando dados...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            {companies.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                  <p className="text-gray-500 mb-4">
                    Nenhuma empresa adicionada
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompany}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Empresa
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {companies.map((company) => (
              <CompanyItem
                key={company.id}
                company={company}
                onChange={updateCompany}
                onDelete={deleteCompany}
              />
            ))}
          </>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700"
          disabled={companies.length === 0 || loading || saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : "Salvar Dados"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
