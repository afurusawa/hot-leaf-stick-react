import { BrandGetDTO } from "../brands/brand.types";
import { Vitola } from "../vitolas/vitola.types";

export interface CigarResponse {
  id: string;
  name: string;
  brand_id: string;
  brand_name: string;
  vitolas: Vitola[];
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
  }[];
}

export interface CigarCreateDTO {
  name: string;
  brand_id: string;
}
