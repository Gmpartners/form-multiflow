
import React, { useState } from "react";
import { CompanySector, SectorField } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Building, Briefcase, Tag, Users, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanySectorItemProps {
  entry: CompanySector;
  onChange: (id: string, updatedEntry: Partial<CompanySector>) => void;
  onDelete: (id: string) => void;
}

const CompanySectorItem: React.FC<CompanySectorItemProps> = ({ entry, onChange, onDelete }) => {
  const [newField, setNewField] = useState("");

  const addField = () => {
    if (!newField.trim()) return;
    
    const newSectorField: SectorField = {
      name: newField.trim(),
    };
    
    onChange(entry.id, { 
      setor_campos: [...(entry.setor_campos || []), newSectorField] 
    });
    
    setNewField("");
  };

  const removeField = (fieldIndex: number) => {
    onChange(entry.id, {
      setor_campos: entry.setor_campos.filter((_, index) => index !== fieldIndex)
    });
  };

  return (
    <Card className="mb-8 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-secondary/70 to-secondary/20 pb-4 relative">
        <div className="absolute top-0 right-0 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Empresa e Setor
            {entry.created_at && (
              <span className="text-xs ml-2 text-gray-500 font-normal">
                Criado em: {new Date(entry.created_at).toLocaleDateString('pt-BR')}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dados da Empresa */}
          <div className="space-y-5">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <Building className="h-4 w-4" />
              Dados da Empresa
            </h3>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome da Empresa</label>
              <Input
                placeholder="Nome da empresa"
                value={entry.empresa_nome}
                onChange={(e) => onChange(entry.id, { empresa_nome: e.target.value })}
                className="input-focus border-gray-300"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Descrição da Empresa</label>
              <Textarea
                placeholder="Descrição da empresa"
                value={entry.empresa_descricao}
                onChange={(e) => onChange(entry.id, { empresa_descricao: e.target.value })}
                className="resize-none h-24 input-focus border-gray-300"
              />
            </div>
          </div>
          
          {/* Dados do Setor */}
          <div className="space-y-5">
            <h3 className="font-medium text-primary flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Dados do Setor
            </h3>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome do Setor</label>
              <Input
                placeholder="Nome do setor"
                value={entry.setor_nome}
                onChange={(e) => onChange(entry.id, { setor_nome: e.target.value })}
                className="input-focus border-gray-300"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Descrição do Setor</label>
              <Textarea
                placeholder="Descrição do setor"
                value={entry.setor_descricao}
                onChange={(e) => onChange(entry.id, { setor_descricao: e.target.value })}
                className="resize-none h-24 input-focus border-gray-300"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Quando Transferir</label>
              <Textarea
                placeholder="Tipos de problemas que este setor resolve"
                value={entry.setor_quando_transferir}
                onChange={(e) => onChange(entry.id, { setor_quando_transferir: e.target.value })}
                className="resize-none h-24 input-focus border-gray-300"
              />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Responsável pelo Setor</span>
                  </label>
                  <Input
                    placeholder="Nome do responsável"
                    value={entry.setor_responsavel_nome}
                    onChange={(e) => onChange(entry.id, { setor_responsavel_nome: e.target.value })}
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
                    value={entry.setor_responsavel_email}
                    onChange={(e) => onChange(entry.id, { setor_responsavel_email: e.target.value })}
                    className="input-focus border-gray-300"
                    type="email"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
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
                  className="flex items-center border-primary/30 text-primary hover:bg-primary/5 hover:border-primary whitespace-nowrap"
                  disabled={!newField.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              
              {entry.setor_campos && entry.setor_campos.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3 p-3 bg-white rounded-md border border-gray-100">
                  {entry.setor_campos.map((field, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="px-3 py-1.5 flex items-center gap-1.5 bg-secondary text-secondary-foreground"
                    >
                      {field.name}
                      <button
                        onClick={() => removeField(index)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySectorItem;
