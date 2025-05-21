
export interface SectorField {
  id?: string;
  name: string;
}

export interface CompanySector {
  id: string;
  empresa_nome: string;
  empresa_descricao: string;
  setor_nome: string;
  setor_descricao: string;
  setor_quando_transferir: string;
  setor_responsavel_nome: string;
  setor_responsavel_email: string;
  setor_campos: SectorField[];
  created_at?: string;
  updated_at?: string;
}
