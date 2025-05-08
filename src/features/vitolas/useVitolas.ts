import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createVitola, updateVitola, deleteVitola, getVitolas } from './vitola.api';
import { UpdateVitolaDTO } from './vitola.types';

export const vitolaQueryKeys = {
  vitolas: ['vitolas'] as const,
  byVitolaId: (vitolaId: string) => [...vitolaQueryKeys.vitolas, 'byVitolaId', vitolaId] as const,
};

export const useGetVitolas = () => {
  return useQuery({
    queryKey: vitolaQueryKeys.vitolas,
    queryFn: getVitolas,
  });
};

export const useCreateVitola = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVitola,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vitolaQueryKeys.byVitolaId(data.id) });
    },
  });
};

export const useUpdateVitola = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVitolaDTO }) => updateVitola(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vitolaQueryKeys.byVitolaId(data.id) });
    },
  });
};

export const useDeleteVitola = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteVitola,
    onSuccess: (_, vitolaId) => {
      queryClient.invalidateQueries({ queryKey: vitolaQueryKeys.byVitolaId(vitolaId) });
    },
  });
}; 