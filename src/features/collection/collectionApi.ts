import axios from 'axios';
import { API_URL } from '@/shared/config/config';
import { CollectionGetDTO, CollectionPayload } from './collectionItem';

const PATH_URL = `${API_URL}/collection`;

export const getCollection = async () => {
  const response = await axios.get<CollectionGetDTO[]>(`${PATH_URL}`);
  return response.data;
};

export const addCollectionItem = async (item: CollectionPayload) => {
  const response = await axios.post(`${PATH_URL}`, item);
  return response.data;
};

export const updateCollectionItem = async (id: string, item: CollectionPayload) => {
  const response = await axios.patch(`${PATH_URL}/${id}`, item);
  return response.data;
};