import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from "@/shared/lib/queryClient";
import { addCollectionItem, getCollection } from './collectionApi';

export const collectionQueryKeys = {
  all: ['collection'] as const,
};

export const useGetCollection = () => {
  return useQuery({
    queryKey: collectionQueryKeys.all,
    queryFn: getCollection,
  });
};

export const useAddCigar = () => {
  return useMutation({
    mutationFn: addCollectionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all });
    },
  });
};
