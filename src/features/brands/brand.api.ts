import axios from 'axios';
import { API_URL } from '@/shared/config/config';
import { BrandGetDTO, BrandCreateDTO } from './brand.types';

const PATH_URL = `${API_URL}/brands`;

export const getBrands = async () => {
  const response = await axios.get<BrandGetDTO[]>(`${PATH_URL}`);
  return response.data;
};

export const getBrandById = async (id: string) => {
  const response = await axios.get<BrandGetDTO>(`${PATH_URL}/${id}`);
  return response.data;
};

export const createBrand = async (brand: BrandCreateDTO) => {
  const response = await axios.post(`${PATH_URL}`, brand);
  return response.data;
};

export const updateBrand = async (id: string, brand: BrandCreateDTO) => {
  const response = await axios.patch(`${PATH_URL}/${id}`, brand);
  return response.data;
};

export const deleteBrand = async (id: string) => {
  await axios.delete(`${PATH_URL}/${id}`);
};