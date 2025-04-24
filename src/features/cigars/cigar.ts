import { BrandGetDTO } from "../brands/brand";

export interface Cigar {
  id?: string;
  name: string;
  brand_id: string;
  brand?: BrandGetDTO; // joined
}

export interface CigarGetDTO {
  id: string;
  name: string;
  brand_id: string;
  brand_name: string;
  vitolas: {
    id: string;
    name: string;
    length: number;
    ring_gauge: number;
  };
}

export interface CigarPayload {
  name: string;
  brand_id: string;
}