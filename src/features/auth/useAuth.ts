import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from './auth.api';
import { LoginRequest, RegisterRequest } from './auth.types';

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const register = async (data: RegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await authApi.register(data);
      navigate({ to: '/login' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authApi.login(data);
      localStorage.setItem('accessToken', response.access_token);
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate({ to: '/login' });
  };

  return {
    register,
    login,
    logout,
    error,
    isLoading,
  };
} 