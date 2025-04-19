// src/api/cigarApi.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Brand, Cigar, CollectionEntry } from './collectionEntry';

const API_URL = 'http://localhost:4000/api';

// API CALLS
export const getCollection = async () => {
  const response = await axios.get<CollectionEntry[]>(`${API_URL}/collection?_embed=cigar&_embed=brand`);
  return response.data;
};

export const getBrands = async () => {
  const response = await axios.get<Brand[]>(`${API_URL}/brands`);
  return response.data;
};

export const getBrandById = async (id: string) => {
  const response = await axios.get<{ id: string, name: string }>(`${API_URL}/brands/${id}`);
  return response.data;
};

export const getCigars = async () => {
  const response = await axios.get<Cigar[]>(`${API_URL}/cigars?_embed=brand`);
  return response.data;
};

export const getCigarById = async (id: string) => {
  const response = await axios.get<Cigar>(`${API_URL}/cigars/${id}`);
  return response.data;
};

export const getCigarByName = async (name: string) => {
  const response = await axios.get<Cigar[]>(`${API_URL}/cigars?name=${name}`);
  return response.data;
};

// QUERY KEYS
export const collectionQueryKeys = {
  all: ['collection'] as const,
};

export const cigarQueryKeys = {
  cigars: ['cigars'] as const,
  cigarById: (id: string) => ['cigars', id] as const,
  brands: ['brands'] as const,
  brandById: (id: string) => ['brands', id] as const,
};

// HOOKS


export const useAddBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brand: Brand) => {
      const response = await axios.post(`${API_URL}/brands`, brand);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.brands });
    },
  });
};

export const useUpdateBrand = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brand: Brand) => {
      const response = await axios.patch(`${API_URL}/brands/${id}`, brand);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.brands });
    },
  });
}

export const useAddCigar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: CollectionEntry) => {
      const response = await axios.post(`${API_URL}/collection`, entry);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all });
    },
  });
};

export const useUpdateCigar = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cigar: Cigar) => {
      const response = await axios.patch(`${API_URL}/cigars/${id}`, cigar);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigars });
    },
  });
}

export const useGetCollection = () => {
  return useQuery({
    queryKey: collectionQueryKeys.all,
    queryFn: getCollection,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useGetCigarById = (id: string) => {
  return useQuery({
    queryKey: cigarQueryKeys.cigarById(id),
    queryFn: () => getCigarById(id),
    enabled: !!id, // Only run if id is defined
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export const useGetBrandById = (id: string) => {
  return useQuery({
    queryKey: cigarQueryKeys.brandById(id),
    queryFn: () => getBrandById(id),
    enabled: !!id, // Only run if id is defined
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}