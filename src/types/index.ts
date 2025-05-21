
export interface SectorField {
  id?: string;
  name: string;
}

export interface Sector {
  id: string;
  nome: string;
  descricao: string;
  quando_transferir: string;
  responsavel_nome: string;
  responsavel_email: string;
  campos: SectorField[];
}

export interface CompanyWithSectors {
  id: string;
  empresa_nome: string;
  empresa_descricao: string;
  setores: Sector[];
  created_at?: string;
  updated_at?: string;
}
