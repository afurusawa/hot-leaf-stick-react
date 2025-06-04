import { BrandGetDTO } from "../brands/brand.types";
import { VitolaResponse } from "../vitolas/vitola.types";

export interface CigarResponse {
  id: string;
  name: string;
  brand_id: string;
  brand_name: string;
  vitolas: VitolaResponse[]; // joined
  brand?: BrandGetDTO; // joined
}

export interface CigarGetDTO {
  id: string;
  name: string;
    brand_id: string;
    brand_name: string;
  vitolas: VitolaResponse[];
}

export interface CigarCreateDTO {
  name: string;
  brand_id: string;
}
