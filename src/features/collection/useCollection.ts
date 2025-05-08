import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from "@/shared/lib/queryClient";
import { createCollectionItem, getCollection, updateCollectionItem, deleteCollectionItem } from './collection.api';
import { CollectionPayload } from './CollectionItem.types';


export const collectionQueryKeys = {
  all: ['collection'] as const,
};

export const useQueryCollection = () => {
  return useQuery({
    queryKey: collectionQueryKeys.all,
    queryFn: getCollection,
  });
};

export const useCreateCollectionItem = () => {
  return useMutation({
    mutationFn: createCollectionItem,
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

export const useDeleteCollectionItem = () => {
  return useMutation({
    mutationFn: deleteCollectionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionQueryKeys.all });
    },
  });
};