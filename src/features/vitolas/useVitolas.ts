import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVitola, updateVitola, deleteVitola } from './vitola.api';
import { UpdateVitolaDTO } from './vitola.types';

export const vitolaQueryKeys = {
  all: ['vitolas'] as const,
  byCigarId: (cigarId: string) => [...vitolaQueryKeys.all, 'byCigarId', cigarId] as const,
};

export function useCreateVitola() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVitola,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vitolaQueryKeys.byCigarId(data.cigar_id) });
    },
  });
}

export function useUpdateVitola() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVitolaDTO }) => updateVitola(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vitolaQueryKeys.byCigarId(data.cigar_id) });
    },
  });
}

export function useDeleteVitola() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVitola,
    onSuccess: (_, cigarId) => {
      queryClient.invalidateQueries({ queryKey: vitolaQueryKeys.byCigarId(cigarId) });
    },
  });
} 