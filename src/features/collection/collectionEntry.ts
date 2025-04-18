//  Used to display collection entires on the collection page
export interface CollectionEntry {
  id: string;
  cigarId: string;
  brandId: string;
  quantity: number;
  storageDate: string;
  custom?: {
    cigarName: string;
    brandName: string;
    vitola: Vitola;
  },
  cigar?: Cigar; // joined
  brand?: Brand; // joined
}

export interface CollectionEntryForm {
  cigarName: string;
  brandName: string;
  quantity: number;
  vitola: Vitola;
  storageDate: Date;
}

export interface Vitola {
  id?: string;
  name: string;
  length: number;
  ringGauge: number;
}

export interface Brand {
  id?: string;
  name: string;
  siteUrl: string;
}

export interface Cigar {
  id?: string;
  name: string;
  brandId: string;
  brand?: Brand; // joined
}