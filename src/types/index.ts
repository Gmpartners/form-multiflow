
export interface SectorField {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  whenToTransfer: string;
  fields: SectorField[];
  responsiblePerson: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  sectors: Sector[];
}
