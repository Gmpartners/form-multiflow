
import React, { useState, useEffect } from "react";
import { Company, Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CompanyItem from "./CompanyItem";
import { supabaseAdmin } from "@/integrations/supabase/client";
import { getClientId } from "@/lib/clientManager";

const CompanyForm: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);

  // Obter o ID do cliente ao montar o componente
  useEffect(() => {
    const initClient = async () => {
      const id = await getClientId();
      setClientId(id);
    };
    
    initClient();
  }, []);

  // Carregar empresas do Supabase quando o componente for montado e o clientId estiver disponível
  useEffect(() => {
    if (!clientId) return;
    
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // Buscar todas as empresas do cliente atual
        const { data: companiesData, error: companiesError } = await supabaseAdmin
          .from('companies')
          .select('id, name, description, created_at')
          .eq('client_id', clientId);
        
        if (companiesError) throw companiesError;
        
        // Para cada empresa, buscar seus setores
        const companiesWithSectors = await Promise.all(companiesData.map(async (company) => {
          // Buscar setores da empresa
          const { data: sectorsData, error: sectorsError } = await supabaseAdmin
            .from('sectors')
            .select('id, name, description, when_to_transfer, responsible_person, responsible_email')
            .eq('company_id', company.id);
          
          if (sectorsError) throw sectorsError;
          
          // Para cada setor, buscar seus campos
          const sectorsWithFields = await Promise.all(sectorsData.map(async (sector) => {
            // Buscar campos do setor
            const { data: fieldsData, error: fieldsError } = await supabaseAdmin
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
              responsibleEmail: sector.responsible_email,
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
  }, [toast, clientId]);

  const addCompany = () => {
    const newCompany: Company = {
      id: `company-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      description: "",
      sectors: [],
    };
    
    setCompanies([...companies, newCompany]);
    
    // Rolagem para o fim da página após adicionar uma nova empresa
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
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
    
    if (!clientId) {
      toast({
        title: "Erro de identificação",
        description: "Não foi possível identificar o cliente. Recarregue a página e tente novamente.",
        variant: "destructive",
      });
      return;
    }
    
    // Validação básica - notificação mais amigável
    const isValid = companies.every(
      (company) => 
        company.name.trim() !== "" && 
        company.sectors.every((sector) => 
          sector.name.trim() !== "" && 
          sector.responsiblePerson.trim() !== ""
        )
    );
    
    if (!isValid) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha pelo menos o nome da empresa, nome do setor e responsável.",
        variant: "default", // Mudado de destructive para default
      });
      return;
    }
    
    if (companies.length === 0) {
      toast({
        title: "Nenhuma empresa",
        description: "Adicione pelo menos uma empresa ao formulário.",
        variant: "default", // Mudado de destructive para default
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
          const { data, error } = await supabaseAdmin
            .from('companies')
            .insert({
              name: company.name,
              description: company.description,
              client_id: clientId
            })
            .select('id')
            .single();
          
          if (error) throw error;
          companyId = data.id;
        } else {
          // Atualizar empresa existente
          const { error } = await supabaseAdmin
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
            const { data, error } = await supabaseAdmin
              .from('sectors')
              .insert({
                company_id: companyId,
                name: sector.name,
                description: sector.description,
                when_to_transfer: sector.whenToTransfer,
                responsible_person: sector.responsiblePerson,
                responsible_email: sector.responsibleEmail,
              })
              .select('id')
              .single();
            
            if (error) throw error;
            sectorId = data.id;
          } else {
            // Atualizar setor existente
            const { error } = await supabaseAdmin
              .from('sectors')
              .update({
                company_id: companyId,
                name: sector.name,
                description: sector.description,
                when_to_transfer: sector.whenToTransfer,
                responsible_person: sector.responsiblePerson,
                responsible_email: sector.responsibleEmail,
              })
              .eq('id', sector.id);
            
            if (error) throw error;
            
            // Apagar campos existentes para reinseri-los (mais simples que comparar e atualizar)
            await supabaseAdmin
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
            
            const { error } = await supabaseAdmin
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
    <form onSubmit={handleSubmit} className="space-y-8 fade-in">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">
            Gerenciar Empresas
          </h2>
          <Button
            type="button"
            onClick={addCompany}
            className="flex items-center bg-primary hover:bg-primary/90 shadow-md"
            disabled={loading || saving || !clientId}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Empresa
          </Button>
        </div>
        
        {loading ? (
          <Card className="p-8 shadow-md">
            <CardContent className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600 font-medium">Carregando dados...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            {companies.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200 shadow-inner bg-gray-50/50">
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-gray-500 mb-4 text-lg">
                    Nenhuma empresa adicionada ainda
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompany}
                    className="flex items-center border-primary text-primary hover:bg-primary/10"
                    disabled={!clientId}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeira Empresa
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
            
            {/* Botão adicional para adicionar empresa na parte inferior da página */}
            {companies.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  onClick={addCompany}
                  variant="outline"
                  className="flex items-center border-primary text-primary hover:bg-primary/10 px-6"
                  disabled={loading || saving || !clientId}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Empresa
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-success hover:bg-success/90 text-white px-6 py-5 text-base font-medium shadow-lg transition-all hover:scale-105"
          disabled={companies.length === 0 || loading || saving || !clientId}
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
