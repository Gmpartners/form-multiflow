
import React, { useState } from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import CompanyItem from "./CompanyItem";

const CompanyForm: React.FC = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // Aqui você pode processar os dados do formulário
    console.log("Dados do formulário:", companies);
    
    toast({
      title: "Formulário enviado",
      description: `${companies.length} empresas e ${companies.reduce(
        (total, company) => total + company.sectors.length,
        0
      )} setores registrados com sucesso!`,
    });
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
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Empresa
          </Button>
        </div>
        
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
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-green-600 hover:bg-green-700"
          disabled={companies.length === 0}
        >
          Salvar Dados
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
