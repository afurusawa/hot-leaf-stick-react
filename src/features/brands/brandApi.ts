import axios from 'axios';
import { API_URL } from '@/shared/config/config';

export const getBrands = async () => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data;
};

export const getBrandById = async (id: string) => {
  const response = await axios.get(`${API_URL}/brands/${id}`);
  return response.data;
};