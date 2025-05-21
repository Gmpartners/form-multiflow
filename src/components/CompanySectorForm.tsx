
import React, { useState, useEffect } from "react";
import { CompanySector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CompanySectorItem from "./CompanySectorItem";
import { supabase } from "@/integrations/supabase/client";

const CompanySectorForm: React.FC = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<CompanySector[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carregar dados do Supabase quando o componente for montado
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Buscar todos os registros da tabela única
        const { data, error } = await supabase
          .from('company_sectors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Garantir que setor_campos seja um array
        const formattedData = data.map(item => ({
          ...item,
          setor_campos: Array.isArray(item.setor_campos) ? item.setor_campos : []
        }));
        
        setEntries(formattedData);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Não foi possível carregar os dados.",
          variant: "destructive",
        });
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const addEntry = () => {
    const newEntry: CompanySector = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      empresa_nome: "",
      empresa_descricao: "",
      setor_nome: "",
      setor_descricao: "",
      setor_quando_transferir: "",
      setor_responsavel_nome: "",
      setor_responsavel_email: "",
      setor_campos: [],
    };
    
    setEntries([newEntry, ...entries]);
    
    // Rolagem para o início da página após adicionar uma nova entrada
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const updateEntry = (id: string, updatedEntry: Partial<CompanySector>) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const isValid = entries.every(
      (entry) => 
        entry.empresa_nome.trim() !== "" && 
        entry.setor_nome.trim() !== ""
    );
    
    if (!isValid) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha pelo menos o nome da empresa e o nome do setor.",
        variant: "default",
      });
      return;
    }
    
    if (entries.length === 0) {
      toast({
        title: "Nenhum registro",
        description: "Adicione pelo menos um registro para salvar.",
        variant: "default",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Processar cada entrada
      for (const entry of entries) {
        // Verificar se é uma nova entrada ou uma existente
        const isNewEntry = entry.id.startsWith('entry-');
        
        if (isNewEntry) {
          // Inserir nova entrada
          const { error } = await supabase
            .from('company_sectors')
            .insert({
              empresa_nome: entry.empresa_nome,
              empresa_descricao: entry.empresa_descricao,
              setor_nome: entry.setor_nome,
              setor_descricao: entry.setor_descricao,
              setor_quando_transferir: entry.setor_quando_transferir,
              setor_responsavel_nome: entry.setor_responsavel_nome,
              setor_responsavel_email: entry.setor_responsavel_email,
              setor_campos: entry.setor_campos,
            });
          
          if (error) throw error;
        } else {
          // Atualizar entrada existente
          const { error } = await supabase
            .from('company_sectors')
            .update({
              empresa_nome: entry.empresa_nome,
              empresa_descricao: entry.empresa_descricao,
              setor_nome: entry.setor_nome,
              setor_descricao: entry.setor_descricao,
              setor_quando_transferir: entry.setor_quando_transferir,
              setor_responsavel_nome: entry.setor_responsavel_nome,
              setor_responsavel_email: entry.setor_responsavel_email,
              setor_campos: entry.setor_campos,
            })
            .eq('id', entry.id);
          
          if (error) throw error;
        }
      }
      
      toast({
        title: "Dados salvos com sucesso",
        description: `${entries.length} registros salvos com sucesso!`,
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
            onClick={addEntry}
            className="flex items-center bg-primary hover:bg-primary/90 shadow-md"
            disabled={loading || saving}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Novo Registro
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
            {entries.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200 shadow-inner bg-gray-50/50">
                <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-gray-500 mb-4 text-lg">
                    Nenhum registro adicionado ainda
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEntry}
                    className="flex items-center border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Registro
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {entries.map((entry) => (
              <CompanySectorItem
                key={entry.id}
                entry={entry}
                onChange={updateEntry}
                onDelete={deleteEntry}
              />
            ))}
            
            {/* Botão adicional para adicionar mais registros */}
            {entries.length > 0 && (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  onClick={addEntry}
                  variant="outline"
                  className="flex items-center border-primary text-primary hover:bg-primary/10 px-6"
                  disabled={loading || saving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Registro
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
          disabled={entries.length === 0 || loading || saving}
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

export default CompanySectorForm;
