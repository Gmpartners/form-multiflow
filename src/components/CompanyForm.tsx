
import React, { useState, useEffect, useRef } from "react";
import { CompanyWithSectors, Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Building, ArrowRight, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CompanyItem from "./CompanyItem";
import { supabase } from "@/integrations/supabase/client";
import SuccessMessage from "./SuccessMessage";

const CompanyForm: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CompanyWithSectors[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [totalSaved, setTotalSaved] = useState({ companies: 0, sectors: 0 });
  const lastCompanyRef = useRef<HTMLDivElement>(null);

  // Carregar dados do Supabase quando o componente for montado
  useEffect(() => {
    fetchData();
  }, []);

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

  const addCompany = () => {
    const newCompany: CompanyWithSectors = {
      id: `company-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      empresa_nome: "",
      empresa_descricao: "",
      setores: [createEmptySetor()]
    };
    
    // Adicionar a nova empresa ao final do array (no final da lista)
    setCompanies([...companies, newCompany]);
    
    // Resolver o problema de scroll
    setTimeout(() => {
      // Calcular a posição para fazer um scroll suave de apenas 200-300px
      // Isso evita um scroll completo até o fim da página
      const currentScrollPosition = window.scrollY;
      const scrollAmount = 250; // Ajuste esse valor conforme necessário
      
      window.scrollTo({
        top: currentScrollPosition + scrollAmount,
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

  const resetForm = () => {
    if (window.confirm("Tem certeza que deseja limpar o formulário? Todos os dados não salvos serão perdidos.")) {
      setCompanies([]);
    }
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
      
      // Calcular o total de setores
      const totalSectors = companies.reduce(
        (total, company) => total + company.setores.length, 0
      );
      
      // Armazenar totais para exibir na mensagem de sucesso
      setTotalSaved({
        companies: companies.length,
        sectors: totalSectors
      });
      
      // Mostrar a mensagem de sucesso com animação - permanentemente
      setShowSuccess(true);
      
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

  // Se estiver mostrando a mensagem de sucesso, renderizar apenas ela
  if (showSuccess) {
    return (
      <SuccessMessage 
        totalCompanies={totalSaved.companies} 
        totalSectors={totalSaved.sectors}
        onReset={() => {
          setShowSuccess(false);
          setCompanies([]);
        }}
      />
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 fade-in"
      // Evitar submissão acidental ao pressionar Enter
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      }}
    >
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-primary">
            Empresas e Setores
          </h2>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={resetForm}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm h-10 sm:text-base"
              disabled={loading || saving || companies.length === 0}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 sm:h-4 sm:w-4 sm:mr-2" />
              Limpar
            </Button>
            <Button
              type="button"
              onClick={addCompany}
              className="flex items-center bg-primary hover:bg-primary/90 shadow-md text-sm h-10 sm:text-base"
              disabled={loading || saving}
            >
              <Plus className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
              <Building className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
              Adicionar Empresa
            </Button>
          </div>
        </div>
        
        {loading ? (
          <Card className="p-4 sm:p-8 shadow-md">
            <CardContent className="flex justify-center items-center p-2 sm:p-4">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600 font-medium text-sm sm:text-base">Carregando dados...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            {companies.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200 shadow-inner bg-gray-50/50">
                <CardContent className="py-8 sm:py-12 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Building className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <p className="text-gray-500 mb-4 text-base sm:text-lg">
                    Nenhuma empresa adicionada ainda
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addCompany}
                    className="flex items-center border-primary text-primary hover:bg-primary/10 text-sm h-10 sm:text-base"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5 sm:h-4 sm:w-4 sm:mr-2" />
                    Adicionar Primeira Empresa
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {companies.map((company, index) => (
              <div key={company.id} ref={index === companies.length - 1 ? lastCompanyRef : null}>
                <CompanyItem
                  company={company}
                  onChange={updateCompany}
                  onDelete={deleteCompany}
                />
              </div>
            ))}
            
            {/* Botão adicional para adicionar mais empresas */}
            {companies.length > 0 && (
              <div className="flex justify-center pt-2 sm:pt-4">
                <Button
                  type="button"
                  onClick={addCompany}
                  variant="outline"
                  className="flex items-center border-primary text-primary hover:bg-primary/10 px-4 sm:px-6 text-sm h-10 sm:text-base"
                  disabled={loading || saving}
                >
                  <Plus className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                  <Building className="h-3.5 w-3.5 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                  Adicionar Nova Empresa
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="submit" 
          className="bg-success hover:bg-success/90 text-white px-5 py-4 sm:px-6 sm:py-5 text-sm sm:text-base font-medium shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
          disabled={companies.length === 0 || loading || saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-t-2 border-b-2 border-white mr-1.5 sm:mr-2"></div>
              Salvando...
            </>
          ) : "Salvar Dados"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
