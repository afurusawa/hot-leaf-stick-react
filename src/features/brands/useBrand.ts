import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '@/shared/lib/queryClient';
import { API_URL } from '@/shared/config/config';
import { getBrandById, getBrands } from './brand.api';
import { BrandGetDTO, BrandCreateDTO } from './brand.types';

export const brandQueryKeys = {
  brands: ['brands'] as const,
  brandById: (id: string) => ['brands', id] as const,
};

export const useQueryBrands = (initialData?: BrandGetDTO[]) => {
  return useQuery({
    queryKey: brandQueryKeys.brands,
    queryFn: getBrands,
    initialData,
    staleTime: 0, // Ensure immediate refetch after mutation
  });
};

export const useCreateBrand = () => {
  return useMutation({
    mutationFn: async (brand: BrandCreateDTO) => {
      const response = await axios.post(`${API_URL}/brands`, brand);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.brands });
    },
  });
};

export const useUpdateBrand = (id: string) => {
  return useMutation({
    mutationFn: async (brand: BrandGetDTO) => {
      const response = await axios.patch(`${API_URL}/brands/${id}`, brand);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.brands });
    },
  });
};

export const useQueryBrandById = (id: string) => {
  return useQuery({
    queryKey: brandQueryKeys.brandById(id),
    queryFn: () => getBrandById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};