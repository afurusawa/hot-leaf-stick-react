import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import { createBrand, getBrandById, getBrands, updateBrand } from './brand.api';
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
    mutationFn: (brand: BrandCreateDTO) => createBrand(brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandQueryKeys.brands });
    },
  });
};

export const useUpdateBrand = (id: string) => {
  return useMutation({
    mutationFn: (brand: BrandCreateDTO) => updateBrand(id, brand),
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
  });
};