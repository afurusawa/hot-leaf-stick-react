export interface Vitola {
  id: string;
  name: string;
  length: number;
  ring_gauge: number;
  cigar_id: string;
}

export interface CreateVitolaDTO {
  cigar_id: string;
  name: string;
  length: number;
  ring_gauge: number;
}

export interface UpdateVitolaDTO extends Partial<CreateVitolaDTO> {
  id: string;
}

export interface VitolaResponse {
  id: string;
  name: string;
  length: number;
  ring_gauge: number;
  cigar_id: string;
  created_at: string;
  updated_at: string;
} 