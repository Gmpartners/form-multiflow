
import React from "react";
import { CompanyWithSectors, Sector } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Building, Briefcase } from "lucide-react";
import SectorItem from "./SectorItem";

interface CompanyItemProps {
  company: CompanyWithSectors;
  onChange: (id: string, updatedCompany: Partial<CompanyWithSectors>) => void;
  onDelete: (id: string) => void;
}

const CompanyItem: React.FC<CompanyItemProps> = ({ company, onChange, onDelete }) => {
  const addSetor = (e: React.MouseEvent) => {
    // Prevenir comportamento padrão para garantir que o evento não se propague
    e.preventDefault();
    e.stopPropagation();
    
    const newSetor: Sector = {
      id: `setor-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      nome: "",
      descricao: "",
      quando_transferir: "",
      responsavel_nome: "",
      responsavel_email: "",
      campos: [],
    };
    
    onChange(company.id, {
      setores: [...company.setores, newSetor],
    });
  };

  const updateSetor = (id: string, updatedSetor: Partial<Sector>) => {
    const updatedSetores = company.setores.map((setor) =>
      setor.id === id ? { ...setor, ...updatedSetor } : setor
    );
    
    onChange(company.id, { setores: updatedSetores });
  };

  const deleteSetor = (id: string) => {
    onChange(company.id, {
      setores: company.setores.filter((setor) => setor.id !== id),
    });
  };

  return (
    <Card className="mb-5 sm:mb-8 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/70 to-secondary/20 pb-3 sm:pb-4 relative p-3 sm:p-4">
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(company.id)}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 rounded-full h-6 w-6 sm:h-8 sm:w-8 p-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {company.empresa_nome || "Nova Empresa"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-4 sm:space-y-5">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5">Nome da Empresa</label>
            <Input
              placeholder="Nome da empresa"
              value={company.empresa_nome}
              onChange={(e) => onChange(company.id, { empresa_nome: e.target.value })}
              className="input-focus border-gray-300 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5">Descrição da Empresa</label>
            <Textarea
              placeholder="Descrição da empresa"
              value={company.empresa_descricao}
              onChange={(e) => onChange(company.id, { empresa_descricao: e.target.value })}
              className="resize-none h-24 sm:h-32 input-focus border-gray-300 text-sm sm:text-base"
            />
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-accent/20 p-1 sm:p-1.5 rounded-full">
                <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent-foreground" />
              </div>
              <h3 className="font-medium text-gray-700 text-sm sm:text-base">
                Setores da Empresa ({company.setores.length})
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSetor}
              className="flex items-center text-primary border-primary/30 hover:bg-primary/5 hover:border-primary transition-colors h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-1" />
              Adicionar Setor
            </Button>
          </div>
          
          <div className="pl-0 sm:pl-2">
            {company.setores.length > 0 ? (
              <div className="space-y-4 sm:space-y-5">
                {company.setores.map((setor) => (
                  <SectorItem
                    key={setor.id}
                    setor={setor}
                    onChange={updateSetor}
                    onDelete={deleteSetor}
                  />
                ))}
              </div>
            ) : (
              <div className="py-4 sm:py-6 px-3 sm:px-4 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50/50">
                <p className="text-gray-500 text-xs sm:text-sm mb-3">
                  Esta empresa ainda não possui setores. Adicione um setor para prosseguir.
                </p>
                <Button
                  type="button"
                  onClick={addSetor}
                  className="bg-accent/10 hover:bg-accent/20 text-accent-foreground text-xs sm:text-sm"
                  size="sm"
                >
                  <Plus className="h-3 w-3 mr-1 sm:h-3.5 sm:w-3.5 sm:mr-1" />
                  Adicionar Primeiro Setor
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {company.setores.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-2 sm:pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="button"
              onClick={addSetor}
              className="flex items-center text-primary border-primary/30 hover:bg-primary/5 hover:border-primary transition-colors"
              variant="outline"
              size="sm"
            >
              <Plus className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-1" />
              Adicionar Novo Setor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyItem;
