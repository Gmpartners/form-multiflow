
import React from "react";
import { Sector } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SectorItemProps {
  sector: Sector;
  onChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const SectorItem: React.FC<SectorItemProps> = ({ sector, onChange, onDelete }) => {
  return (
    <div className="flex items-center space-x-2 mb-2 animate-in fade-in-50 slide-in-from-left-4 duration-300">
      <Input
        placeholder="Nome do setor"
        value={sector.name}
        onChange={(e) => onChange(sector.id, e.target.value)}
        className="flex-grow"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(sector.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SectorItem;
