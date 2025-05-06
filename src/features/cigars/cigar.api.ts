import { api, API_URL } from '@/lib/api';
import type { CigarGetDTO, CigarCreateDTO } from './cigar.types';

const PATH_URL = `${API_URL}/cigars`;

export const getCigars = async () => {
  const response = await api.get<CigarGetDTO[]>(`${PATH_URL}`);
  return response.data;
};

export const getCigarById = async (id: string) => {
  const response = await api.get<CigarGetDTO>(`${PATH_URL}/${id}`);
  return response.data;
};

export const getCigarByName = async (name: string) => {
  const response = await api.get<CigarGetDTO[]>(`${PATH_URL}?name=${name}`);
  return response.data;
};

export const createCigar = async (cigar: CigarCreateDTO) => {
  const response = await api.post(`${PATH_URL}`, cigar);
  return response.data;
};

export const updateCigar = async (id: string, cigar: CigarCreateDTO) => {
  const response = await api.patch(`${PATH_URL}/${id}`, cigar);
  return response.data;
};

