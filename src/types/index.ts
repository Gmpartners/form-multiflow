
export interface Sector {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  sectors: Sector[];
}
