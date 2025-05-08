import { api, API_URL } from '@/lib/api';
import { CreateVitolaDTO, UpdateVitolaDTO, VitolaResponse } from './vitola.types';

const PATH_URL = `${API_URL}/vitolas`;

export async function getVitolas(): Promise<VitolaResponse[]> {
  const response = await api.get<VitolaResponse[]>(`${PATH_URL}`);
  return response.data;
}

export async function getVitolasByCigar(cigarId: string): Promise<VitolaResponse[]> {
  const response = await api.get<VitolaResponse[]>(`${PATH_URL}/by-cigar/${cigarId}`);
  return response.data;
}

export async function createVitola(data: CreateVitolaDTO): Promise<VitolaResponse> {
  const response = await api.post<VitolaResponse>(`${PATH_URL}`, data);
  return response.data;
}

export async function updateVitola(id: string, data: UpdateVitolaDTO): Promise<VitolaResponse> {
  const response = await api.put<VitolaResponse>(`${PATH_URL}/${id}`, data);
  return response.data;
}

export async function deleteVitola(id: string): Promise<void> {
  await api.delete(`${PATH_URL}/${id}`);
} 