import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import { addCigar, getCigarById, updateCigar } from './cigarApi';
import type { Cigar } from './cigar';

export const cigarQueryKeys = {
  cigars: ['cigars'] as const,
  cigarById: (id: string) => ['cigars', id] as const,
};

export const useGetCigarById = (id: string) => {
  return useQuery({
    queryKey: cigarQueryKeys.cigarById(id),
    queryFn: () => getCigarById(id),
    enabled: !!id,
  });
};

export const useAddCigar = () => {
  return useMutation({
    mutationFn: addCigar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigars });
    },
  })
}

export const useUpdateCigar = (id: string) => {
  return useMutation({
    mutationFn: (cigar: Cigar) => updateCigar(id, cigar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigars });
    },
  });
};