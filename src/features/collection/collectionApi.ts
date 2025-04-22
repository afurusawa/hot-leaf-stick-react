import axios from 'axios';
import { API_URL } from '@/shared/config/config';
import { CollectionItem } from './collectionItem';

const PATH_URL = `${API_URL}/collection`;

export const getCollection = async () => {
  const response = await axios.get<CollectionItem[]>(`${PATH_URL}`);
  return response.data;
};

export const addCollectionItem = async (item: CollectionItem) => {
  const response = await axios.post(`${PATH_URL}`, item);
  return response.data;
}