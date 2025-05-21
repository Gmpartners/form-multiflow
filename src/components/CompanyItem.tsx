
import React from "react";
import { Company } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import SectorItem from "./SectorItem";

interface CompanyItemProps {
  company: Company;
  onChange: (id: string, updatedCompany: Partial<Company>) => void;
  onDelete: (id: string) => void;
}

const CompanyItem: React.FC<CompanyItemProps> = ({ company, onChange, onDelete }) => {
  const addSector = () => {
    const newSector = {
      id: `sector-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
    };
    
    onChange(company.id, {
      sectors: [...company.sectors, newSector],
    });
  };

  const updateSector = (id: string, name: string) => {
    const updatedSectors = company.sectors.map((sector) =>
      sector.id === id ? { ...sector, name } : sector
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
        <Input
          placeholder="Nome da empresa"
          value={company.name}
          onChange={(e) => onChange(company.id, { name: e.target.value })}
          className="mb-4"
        />
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm text-blue-700">Setores</h3>
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
          
          <div className="pl-2 border-l-2 border-blue-100">
            {company.sectors.length > 0 ? (
              company.sectors.map((sector) => (
                <SectorItem
                  key={sector.id}
                  sector={sector}
                  onChange={updateSector}
                  onDelete={deleteSector}
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                Nenhum setor adicionado
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyItem;
