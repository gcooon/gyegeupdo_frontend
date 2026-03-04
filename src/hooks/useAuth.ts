'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get<{ success: boolean; data: User }>('/users/me/');
      setState({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{
      access: string;
      refresh: string;
    }>('/auth/token/', { email, password });

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    await checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  return {
    ...state,
    login,
    logout,
    checkAuth,
  };
}
