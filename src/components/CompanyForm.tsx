
import React, { useState, useEffect } from "react";
import { CompanyWithSectors, Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CompanyItem from "./CompanyItem";
import { supabase } from "@/integrations/supabase/client";

const CompanyForm: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CompanyWithSectors[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar dados do Supabase quando o componente for montado
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar todos os registros
        const { data, error } = await supabase
          .from('companies_with_sectors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Garantir que setores seja um array
        const formattedData = data.map(item => ({
          ...item,
          setores: Array.isArray(item.setores) ? item.setores : []
        }));
        
        setCompanies(formattedData);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar as empresas.",
          variant: "destructive",
        });
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const addCompany = () => {
    const newCompany: CompanyWithSectors = {
      id: `company-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      empresa_nome: "",
      empresa_descricao: "",
      setores: [createEmptySetor()]
    };
    
    setCompanies([newCompany, ...companies]);
    
    // Rolagem para o início da página após adicionar uma nova empresa
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const createEmptySetor = (): Sector => {
    return {
      id: `setor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      nome: "",
      descricao: "",
      quando_transferir: "",
      responsavel_nome: "",
      responsavel_email: "",
      campos: []
    };
  };

  const updateCompany = (id: string, updatedCompany: Partial<CompanyWithSectors>) => {
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
        company.empresa_nome.trim() !== "" && 
        company.setores.every((setor) => 
          setor.nome.trim() !== "" && 
          setor.responsavel_nome.trim() !== ""
        )
    );
    
    if (!isValid) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha pelo menos o nome da empresa, nome do setor e responsável.",
        variant: "default",
      });
      return;
    }
    
    if (companies.length === 0) {
      toast({
        title: "Nenhuma empresa",
        description: "Adicione pelo menos uma empresa para salvar.",
        variant: "default",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Salvar cada empresa com seus setores
      for (const company of companies) {
        // Verificar se é uma nova empresa ou uma existente
        const isNewCompany = company.id.startsWith('company-');
        
        if (isNewCompany) {
          // Inserir nova empresa
          const { error } = await supabase
            .from('companies_with_sectors')
            .insert({
              empresa_nome: company.empresa_nome,
              empresa_descricao: company.empresa_descricao,
              setores: company.setores
            });
          
          if (error) throw error;
        } else {
          // Atualizar empresa existente
          const { error } = await supabase
            .from('companies_with_sectors')
            .update({
              empresa_nome: company.empresa_nome,
              empresa_descricao: company.empresa_descricao,
              setores: company.setores
            })
            .eq('id', company.id);
          
          if (error) throw error;
        }
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: `${companies.length} empresas e ${companies.reduce(
          (total, company) => total + company.setores.length,
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
            Empresas e Setores
          </h2>
          <Button
            type="button"
            onClick={addCompany}
            className="flex items-center bg-primary hover:bg-primary/90 shadow-md"
            disabled={loading || saving}
          >
            <Plus className="h-4 w-4 mr-2" />
            <Building className="h-4 w-4 mr-2" />
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
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-gray-500 mb-4 text-lg">
                    Nenhuma empresa adicionada ainda
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompany}
                    className="flex items-center border-primary text-primary hover:bg-primary/10"
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
            
            {/* Botão adicional para adicionar mais empresas */}
            {companies.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  onClick={addCompany}
                  variant="outline"
                  className="flex items-center border-primary text-primary hover:bg-primary/10 px-6"
                  disabled={loading || saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <Building className="h-4 w-4 mr-2" />
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
