import axios from 'axios';
import { API_URL } from '@/shared/config/config';
import { Cigar } from './cigar';

const PATH_URL = `${API_URL}/cigars`;

export const getCigars = async () => {
  const response = await axios.get<Cigar[]>(`${PATH_URL}`);
  return response.data;
};

export const getCigarById = async (id: string) => {
  const response = await axios.get<Cigar>(`${PATH_URL}/${id}`);
  return response.data;
};

export const getCigarByName = async (name: string) => {
  const response = await axios.get<Cigar[]>(`${PATH_URL}?name=${name}`);
  return response.data;
};

export const addCigar = async (cigar: Cigar) => {
  const response = await axios.post(`${PATH_URL}`, cigar);
  return response.data;
};

export const updateCigar = async (id: string, cigar: Cigar) => {
  const response = await axios.patch(`${PATH_URL}/${id}`, cigar);
  return response.data;
};

