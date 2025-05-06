import { api, API_URL } from '@/lib/api';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './auth.types';

const PATH_URL = `${API_URL}/auth`;

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(`${PATH_URL}/register`, data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${PATH_URL}/login`, data);
    return response.data;
  },
}; 