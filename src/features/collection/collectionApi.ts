// src/api/cigarApi.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3001/collection';

export interface Cigar {
  id?: number;
  name: string;
  brand: string;
  price: number;
}

// API CALLS
export const getCollection = async () => {
  const response = await axios.get<Cigar[]>(API_URL);
  return response.data;
};

// QUERY KEYS
export const collectionQueryKeys = {
  all: ['collection'] as const,
};

// HOOKS

export const useAddCigar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cigar: Cigar) => {
      const response = await axios.post(API_URL, cigar);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all });
    },
  });
};

export const useGetCollection = () => {
  return useQuery({
    queryKey: collectionQueryKeys.all,
    queryFn: getCollection,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};