
import React from "react";
import { Company, Sector } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
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
      fields: "",
      responsiblePerson: "",
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
    <Card className="mb-6 border-blue-200 shadow-sm animate-in fade-in-50 slide-in-from-top-4 duration-300">
      <CardHeader className="bg-blue-50 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium text-blue-800">Empresa</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(company.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Nome da Empresa</label>
            <Input
              placeholder="Nome da empresa"
              value={company.name}
              onChange={(e) => onChange(company.id, { name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Descrição Detalhada</label>
            <Textarea
              placeholder="Descrição detalhada da empresa"
              value={company.description}
              onChange={(e) => onChange(company.id, { description: e.target.value })}
              className="resize-none h-32"
            />
            <p className="text-sm text-gray-500 mt-1 italic">
              Ex: "Empresa especializada em tecnologia fundada em 2010, focada em soluções de software para o setor financeiro. Possui mais de 200 funcionários e atende clientes em todo o Brasil."
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-blue-700">Setores</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addSector}
              className="flex items-center text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Setor
            </Button>
          </div>
          
          <div className="pl-2">
            {company.sectors.length > 0 ? (
              <div className="space-y-4">
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
              <p className="text-sm text-gray-500 italic py-4 px-2 border border-dashed border-gray-300 rounded-md text-center">
                Nenhum setor adicionado. Clique em "Adicionar Setor" para começar.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyItem;
