
import React, { useState } from "react";
import { Sector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Tag, Users, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SectorItemProps {
  setor: Sector;
  onChange: (id: string, updatedSetor: Partial<Sector>) => void;
  onDelete: (id: string) => void;
}

const SectorItem: React.FC<SectorItemProps> = ({ setor, onChange, onDelete }) => {
  const [newField, setNewField] = useState("");

  const addField = () => {
    if (!newField.trim()) return;
    
    const newSectorField: SectorField = {
      name: newField.trim(),
    };
    
    onChange(setor.id, { 
      campos: [...(setor.campos || []), newSectorField] 
    });
    
    setNewField("");
  };

  const removeField = (fieldIndex: number) => {
    onChange(setor.id, {
      campos: setor.campos.filter((_, index) => index !== fieldIndex)
    });
  };

  return (
    <div className="p-3 sm:p-5 border border-l-4 border-l-accent rounded-lg mb-4 sm:mb-5 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="bg-accent/20 p-1 sm:p-1.5 rounded-full">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent-foreground" />
          </div>
          <h4 className="font-medium text-gray-700 text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">
            {setor.nome || "Novo Setor"}
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(setor.id)}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-6 w-6 sm:h-8 sm:w-8 p-0"
        >
          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5">Nome do Setor</label>
          <Input
            placeholder="Nome do setor"
            value={setor.nome}
            onChange={(e) => onChange(setor.id, { nome: e.target.value })}
            className="input-focus border-gray-300 h-9 sm:h-10 text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5">Descrição do Setor</label>
          <Textarea
            placeholder="Descrição do setor"
            value={setor.descricao}
            onChange={(e) => onChange(setor.id, { descricao: e.target.value })}
            className="resize-none h-20 sm:h-24 input-focus border-gray-300 text-sm sm:text-base"
          />
        </div>
        
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5">Quando Transferir</label>
          <Textarea
            placeholder="Tipos de problemas que este setor resolve"
            value={setor.quando_transferir}
            onChange={(e) => onChange(setor.id, { quando_transferir: e.target.value })}
            className="resize-none h-16 sm:h-20 input-focus border-gray-300 text-sm sm:text-base"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5 flex items-center gap-1">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>Responsável pelo Setor</span>
            </label>
            <Input
              placeholder="Nome do responsável"
              value={setor.responsavel_nome}
              onChange={(e) => onChange(setor.id, { responsavel_nome: e.target.value })}
              className="input-focus border-gray-300 h-9 sm:h-10 text-sm sm:text-base"
            />
          </div>
          
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-1.5 flex items-center gap-1">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span>E-mail do Responsável</span>
            </label>
            <Input
              placeholder="email@exemplo.com"
              value={setor.responsavel_email}
              onChange={(e) => onChange(setor.id, { responsavel_email: e.target.value })}
              className="input-focus border-gray-300 h-9 sm:h-10 text-sm sm:text-base"
              type="email"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
          <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1.5 sm:mb-2 flex items-center gap-1">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span>Campos do Setor (opcional)</span>
          </label>
          
          <div className="mb-2 sm:mb-3">
            <div className="flex space-x-2 mb-2 sm:mb-3">
              <Input
                placeholder="nome do lead, email, problema, etc."
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                className="input-focus border-gray-300 h-9 sm:h-10 text-sm sm:text-base"
              />
              <Button 
                type="button" 
                onClick={addField} 
                variant="outline"
                className="flex items-center border-primary/30 text-primary hover:bg-primary/5 hover:border-primary whitespace-nowrap h-9 sm:h-10 text-xs sm:text-sm"
                disabled={!newField.trim()}
              >
                <Plus className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-1" />
                Adicionar
              </Button>
            </div>
            
            {setor.campos && setor.campos.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 p-2 sm:p-3 bg-white rounded-md border border-gray-100">
                {setor.campos.map((field, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 bg-secondary text-secondary-foreground text-xs sm:text-sm"
                  >
                    {field.name}
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="ml-1 bg-secondary-foreground/10 rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 flex items-center justify-center hover:bg-secondary-foreground/20 transition-colors"
                      aria-label={`Remover campo ${field.name}`}
                    >
                      <X className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-secondary-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="p-2 sm:p-3 bg-white text-center border border-dashed border-gray-300 rounded-md text-xs sm:text-sm text-gray-500">
                Nenhum campo adicionado ainda.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorItem;
