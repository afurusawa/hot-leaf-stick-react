//  Used to display collection entires on the collection page
export interface CollectionItem {
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
  // cigar?: Cigar; // joined
  // brand?: Brand; // joined
}

export interface CollectionItemForm {
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
