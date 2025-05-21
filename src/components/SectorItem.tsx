
import React from "react";
import { Sector } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface SectorItemProps {
  sector: Sector;
  onChange: (id: string, updatedSector: Partial<Sector>) => void;
  onDelete: (id: string) => void;
}

const SectorItem: React.FC<SectorItemProps> = ({ sector, onChange, onDelete }) => {
  return (
    <div className="p-4 border border-blue-100 rounded-md mb-4 animate-in fade-in-50 slide-in-from-left-4 duration-300 bg-blue-50/30">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-blue-700">Detalhes do Setor</h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(sector.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Nome do Setor</label>
          <Input
            placeholder="Nome do setor"
            value={sector.name}
            onChange={(e) => onChange(sector.id, { name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Descrição do Setor</label>
          <Textarea
            placeholder="Descreva as responsabilidades e funções deste setor"
            value={sector.description}
            onChange={(e) => onChange(sector.id, { description: e.target.value })}
            className="resize-none h-24"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Quando Transferir</label>
          <Textarea
            placeholder="Tipos de problemas que este setor resolve"
            value={sector.whenToTransfer}
            onChange={(e) => onChange(sector.id, { whenToTransfer: e.target.value })}
            className="resize-none h-20"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Campos do Setor</label>
          <Textarea
            placeholder="Lista de campos específicos para este setor"
            value={sector.fields}
            onChange={(e) => onChange(sector.id, { fields: e.target.value })}
            className="resize-none h-20"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Responsável</label>
          <Input
            placeholder="Nome do responsável pelo setor"
            value={sector.responsiblePerson}
            onChange={(e) => onChange(sector.id, { responsiblePerson: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default SectorItem;
