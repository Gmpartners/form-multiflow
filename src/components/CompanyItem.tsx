
import React from "react";
import { Company, Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Building, Briefcase } from "lucide-react";
import SectorItem from "./SectorItem";

interface CompanyItemProps {
  company: Company;
  onChange: (id: string, updatedCompany: Partial<Company>) => void;
  onDelete: (id: string) => void;
}

const CompanyItem: React.FC<CompanyItemProps> = ({ company, onChange, onDelete }) => {
  const addSector = () => {
    const newSector: Sector = {
      id: `sector-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      description: "",
      whenToTransfer: "",
      fields: [],
      responsiblePerson: "",
      responsibleEmail: "",
    };
    
    onChange(company.id, {
      sectors: [...company.sectors, newSector],
    });
  };

  const updateSector = (id: string, updatedSector: Partial<Sector>) => {
    const updatedSectors = company.sectors.map((sector) =>
      sector.id === id ? { ...sector, ...updatedSector } : sector
    );
    
    onChange(company.id, { sectors: updatedSectors });
  };

  const deleteSector = (id: string) => {
    onChange(company.id, {
      sectors: company.sectors.filter((sector) => sector.id !== id),
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
          <CardTitle className="text-lg font-semibold text-gray-800">Dados da Empresa</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome da Empresa</label>
            <Input
              placeholder="Nome da empresa"
              value={company.name}
              onChange={(e) => onChange(company.id, { name: e.target.value })}
              className="input-focus border-gray-300"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Descrição da Empresa</label>
            <Textarea
              placeholder="Descrição da empresa"
              value={company.description}
              onChange={(e) => onChange(company.id, { description: e.target.value })}
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
              <h3 className="font-medium text-gray-700">Setores da Empresa</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addSector}
              className="flex items-center text-primary border-primary/30 hover:bg-primary/5 hover:border-primary transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Setor
            </Button>
          </div>
          
          <div className="pl-2">
            {company.sectors.length > 0 ? (
              <div className="space-y-5">
                {company.sectors.map((sector) => (
                  <SectorItem
                    key={sector.id}
                    sector={sector}
                    onChange={updateSector}
                    onDelete={deleteSector}
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
            onClick={addSector}
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
