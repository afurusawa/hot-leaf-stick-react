export interface CollectionGetDTO {
  id: string;
  user_id: string;
  cigar_id: string;
  cigar: {
    id: string;
    name: string;
    brand_id: string;
    brand: {
      id: string;
      name: string;
      site_url: string;
      created_at: string;
      updated_at: string;
    };
    created_at: string;
    updated_at: string;
  };
  vitola_id: string;
  vitola: {
    id: string;
    name: string;
    length: number;
    ring_gauge: number;
  };
  quantity: number;
  storage_date: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionPayload {
  brand_id: string;
  cigar_id: string;
  vitola_id: string;
  quantity: number;
  storage_date: Date;
}
