import { api, API_URL } from '@/lib/api';
import { CollectionGetDTO, CollectionPayload } from './CollectionItem.types';

const PATH_URL = `${API_URL}/collections`;

export const getCollection = async () => {
  const response = await api.get<CollectionGetDTO[]>(`${PATH_URL}`);
  return response.data;
};

export const createCollectionItem = async (item: CollectionPayload) => {
  const response = await api.post(`${PATH_URL}`, item);
  return response.data;
};

export const updateCollectionItem = async (id: string, item: CollectionPayload) => {
  const response = await api.patch(`${PATH_URL}/${id}`, item);
  return response.data;
};

export const deleteCollectionItem = async (id: string) => {
  const response = await api.delete(`${PATH_URL}/${id}`);
  return response.data;
};