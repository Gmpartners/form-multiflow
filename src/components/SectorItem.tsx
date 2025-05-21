
import React, { useState } from "react";
import { Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
          <p className="text-sm text-gray-500 mt-1 italic">
            Ex: "Setor responsável pelo atendimento ao cliente, resolução de problemas técnicos e suporte pós-venda."
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Quando Transferir</label>
          <Textarea
            placeholder="Tipos de problemas que este setor resolve"
            value={sector.whenToTransfer}
            onChange={(e) => onChange(sector.id, { whenToTransfer: e.target.value })}
            className="resize-none h-20"
          />
          <p className="text-sm text-gray-500 mt-1 italic">
            Ex: "Transferir para este setor quando o cliente tiver problemas técnicos com o produto, precisar de orientação sobre uso ou solicitar reparo em garantia."
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Campos do Setor</label>
          
          <div className="mb-2">
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder="Adicionar campo (ex: Nome, CPF, Problema)"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addField()}
              />
              <Button 
                type="button" 
                onClick={addField} 
                variant="outline"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
            
            {sector.fields && sector.fields.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {sector.fields.map((field) => (
                  <Badge 
                    key={field.id} 
                    variant="secondary"
                    className="px-3 py-1 flex items-center gap-1"
                  >
                    {field.name}
                    <button
                      onClick={() => removeField(field.id)}
                      className="ml-1 bg-gray-200 rounded-full h-4 w-4 flex items-center justify-center hover:bg-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <Card className="p-2 bg-gray-50 text-center border-dashed border-gray-300 text-sm text-gray-500">
                Nenhum campo adicionado ainda. Adicione campos como "Nome", "CPF", "Problema", etc.
              </Card>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-1 italic">
            Ex: Campos como "Nome do cliente", "CPF", "Tipo de problema", "Produto", "Data da compra", etc.
          </p>
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
