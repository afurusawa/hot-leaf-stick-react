// import { API_URL } from '@/shared/config/config';
import { api, API_URL } from '@/lib/api';
import type { BrandGetDTO, BrandCreateDTO } from './brand.types';

const PATH_URL = `${API_URL}/brands`;

export const getBrands = async () => {
  const response = await api.get<BrandGetDTO[]>(`${PATH_URL}`);
  return response.data;
};

export const getBrandById = async (id: string) => {
  const response = await api.get<BrandGetDTO>(`${PATH_URL}/${id}`);
  return response.data;
};

export const createBrand = async (brand: BrandCreateDTO) => {
  const response = await api.post(`${PATH_URL}`, brand);
  return response.data;
};

export const updateBrand = async (id: string, brand: BrandCreateDTO) => {
  const response = await api.patch(`${PATH_URL}/${id}`, brand);
  return response.data;
};

export const deleteBrand = async (id: string) => {
  await api.delete(`${PATH_URL}/${id}`);
};