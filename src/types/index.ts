
export interface Sector {
  id: string;
  name: string;
  description: string;
  whenToTransfer: string;
  fields: string;
  responsiblePerson: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  sectors: Sector[];
}
