
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
  const addSetor = () => {
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
    <Card className="mb-8 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/70 to-secondary/20 pb-4 relative">
        <div className="absolute top-0 right-0 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(company.id)}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-800">Empresa: {company.empresa_nome || "Nova Empresa"}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome da Empresa</label>
            <Input
              placeholder="Nome da empresa"
              value={company.empresa_nome}
              onChange={(e) => onChange(company.id, { empresa_nome: e.target.value })}
              className="input-focus border-gray-300"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Descrição da Empresa</label>
            <Textarea
              placeholder="Descrição da empresa"
              value={company.empresa_descricao}
              onChange={(e) => onChange(company.id, { empresa_descricao: e.target.value })}
              className="resize-none h-32 input-focus border-gray-300"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-accent/20 p-1.5 rounded-full">
                <Briefcase className="h-4 w-4 text-accent-foreground" />
              </div>
              <h3 className="font-medium text-gray-700">Setores da Empresa ({company.setores.length})</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addSetor}
              className="flex items-center text-primary border-primary/30 hover:bg-primary/5 hover:border-primary transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Setor
            </Button>
          </div>
          
          <div className="pl-2">
            {company.setores.length > 0 ? (
              <div className="space-y-5">
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
              <div className="py-6 px-4 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50/50">
                <p className="text-gray-500 italic">
                  Nenhum setor adicionado. Clique em "Adicionar Setor" para começar.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div></div> {/* Espaço vazio para manter o botão alinhado à direita */}
          <Button
            type="button"
            onClick={addSetor}
            className="flex items-center text-primary border-primary/30 hover:bg-primary/5 hover:border-primary transition-colors"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Novo Setor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyItem;
