import { BrandGetDTO } from "../brands/brand";
import { Cigar } from "../cigars/cigar";

//  Used to display collection entires on the collection page
// deprecated
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
  cigar?: Cigar; // joined
  brand?: BrandGetDTO; // joined
}

export interface CollectionGetDTO {
  id: string;
  brand_name: string;
  cigar_name: string;
  vitola_name: string;
  vitola_length: number;
  vitola_ring_gauge: number;
  storage_date: string;
}

export interface CollectionPayload {
  brand_id: string;
  cigar_id: string;
  vitola_id: string;
  quantity: number;
  storage_date: Date;
}

export interface CollectionItemForm {
  cigarName: string;
  brandName: string;
  quantity: number;
  vitola: Vitola;
  storageDate: Date;
}

export interface Vitola {
  id: string;
  name: string;
  length: number;
  ring_gauge: number;
}

export interface CustomCollectionGetDTO {
  id: string;
  brand_name: string;
  cigar_name: string;
  vitola_name: string;
  vitola_length: number;
  vitola_ring_gauge: number;
  storage_date: string;
}

export interface CustomCollectionPayload {
  brand_name: string;
  cigar_name: string;
  vitola_name: string;
  vitola_length: number;
  vitola_ring_gauge: number;
  storage_date: string;
}