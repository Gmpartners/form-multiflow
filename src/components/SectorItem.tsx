
import React, { useState } from "react";
import { Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Tag, Users, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectorItemProps {
  sector: Sector;
  onChange: (id: string, updatedSector: Partial<Sector>) => void;
  onDelete: (id: string) => void;
}

const SectorItem: React.FC<SectorItemProps> = ({ sector, onChange, onDelete }) => {
  const [newField, setNewField] = useState("");

  const addField = () => {
    if (!newField.trim()) return;
    
    const newSectorField: SectorField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newField.trim(),
    };
    
    onChange(sector.id, { 
      fields: [...(sector.fields || []), newSectorField] 
    });
    
    setNewField("");
  };

  const removeField = (fieldId: string) => {
    onChange(sector.id, {
      fields: sector.fields.filter((field) => field.id !== fieldId)
    });
  };

  return (
    <div className="p-5 border border-l-4 border-l-accent rounded-lg mb-5 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-accent/20 p-1.5 rounded-full">
            <Users className="h-4 w-4 text-accent-foreground" />
          </div>
          <h4 className="font-medium text-gray-700">Detalhes do Setor</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(sector.id)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome do Setor</label>
          <Input
            placeholder="Nome do setor"
            value={sector.name}
            onChange={(e) => onChange(sector.id, { name: e.target.value })}
            className="input-focus border-gray-300"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Descrição do Setor</label>
          <Textarea
            placeholder="Descreva as responsabilidades e funções deste setor"
            value={sector.description}
            onChange={(e) => onChange(sector.id, { description: e.target.value })}
            className="resize-none h-24 input-focus border-gray-300"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Quando Transferir</label>
          <Textarea
            placeholder="Tipos de problemas que este setor resolve"
            value={sector.whenToTransfer}
            onChange={(e) => onChange(sector.id, { whenToTransfer: e.target.value })}
            className="resize-none h-20 input-focus border-gray-300"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label className="text-sm font-medium text-gray-700 block mb-2 flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-primary" />
            <span>Campos do Setor (opcional)</span>
          </label>
          
          <div className="mb-3">
            <div className="flex space-x-2 mb-3">
              <Input
                placeholder="nome do lead, email, problema, etc."
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
                className="input-focus border-gray-300"
              />
              <Button 
                type="button" 
                onClick={addField} 
                variant="outline"
                className="flex items-center border-primary/30 text-primary hover:bg-primary/5 hover:border-primary"
                disabled={!newField.trim()}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            
            {sector.fields && sector.fields.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-md border border-gray-100">
                {sector.fields.map((field) => (
                  <Badge 
                    key={field.id} 
                    variant="secondary"
                    className="px-3 py-1.5 flex items-center gap-1.5 bg-secondary text-secondary-foreground"
                  >
                    {field.name}
                    <button
                      onClick={() => removeField(field.id)}
                      className="ml-1 bg-secondary-foreground/10 rounded-full h-4 w-4 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
                      aria-label={`Remover campo ${field.name}`}
                    >
                      <X className="h-2.5 w-2.5 text-secondary-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-white text-center border border-dashed border-gray-300 rounded-md text-sm text-gray-500">
                Nenhum campo adicionado ainda.
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>Responsável pelo Setor</span>
            </label>
            <Input
              placeholder="Nome do responsável"
              value={sector.responsiblePerson}
              onChange={(e) => onChange(sector.id, { responsiblePerson: e.target.value })}
              className="input-focus border-gray-300"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-primary" />
              <span>E-mail do Responsável</span>
            </label>
            <Input
              placeholder="email@exemplo.com"
              value={sector.responsibleEmail || ""}
              onChange={(e) => onChange(sector.id, { responsibleEmail: e.target.value })}
              className="input-focus border-gray-300"
              type="email"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorItem;
