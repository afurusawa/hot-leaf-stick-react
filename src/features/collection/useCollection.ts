import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from "@/shared/lib/queryClient";
import { addCollectionItem, getCollection, updateCollectionItem } from './collectionApi';
import { CollectionPayload } from './collectionItem';

export const collectionQueryKeys = {
  all: ['collection'] as const,
};

export const useGetCollection = () => {
  return useQuery({
    queryKey: collectionQueryKeys.all,
    queryFn: getCollection,
  });
};

export const useAddCollectionItem = () => {
  return useMutation({
    mutationFn: addCollectionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all });
    },
  });
};

export const useUpdateCollectionItem = (id: string) => {
  return useMutation({
    mutationFn: (item: CollectionPayload) => updateCollectionItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all });
    },
  });
};