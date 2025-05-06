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
