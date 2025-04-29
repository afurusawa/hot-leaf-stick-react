import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib/queryClient';
import { createCigar, getCigarById, updateCigar } from './cigar.api';
import type { CigarCreateDTO } from './cigar.types';

export const cigarQueryKeys = {
  cigars: ['cigars'] as const,
  cigarById: (id: string) => ['cigars', id] as const,
};

export const useQueryCigarById = (id: string) => {
  return useQuery({
    queryKey: cigarQueryKeys.cigarById(id),
    queryFn: () => getCigarById(id),
    enabled: !!id,
  });
};

export const useCreateCigar = () => {
  return useMutation({
    mutationFn: createCigar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigars });
    },
  });
};

export const useUpdateCigar = (id: string) => {
  return useMutation({
    mutationFn: (cigar: CigarCreateDTO) => updateCigar(id, cigar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigars });
    },
  });
};