import axios from 'axios';
import { API_URL } from '@/shared/config/config';
import { CreateVitolaDTO, UpdateVitolaDTO, VitolaResponse } from './vitola.types';

const PATH_URL = `${API_URL}/vitolas`;

export async function createVitola(data: CreateVitolaDTO): Promise<VitolaResponse> {
  const response = await axios.post<VitolaResponse>(`${PATH_URL}`, data);
  return response.data;
}

export async function updateVitola(id: string, data: UpdateVitolaDTO): Promise<VitolaResponse> {
  const response = await axios.put<VitolaResponse>(`${PATH_URL}/${id}`, data);
  return response.data;
}

export async function deleteVitola(id: string): Promise<void> {
  await axios.delete(`${PATH_URL}/${id}`);
} 