import { create } from 'zustand';
import api from '@/lib/api';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setHasHydrated: (state: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, password2: string, nickname: string) => Promise<{ success: boolean; message: string | Record<string, string[]> }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  _hasHydrated: false,

  setUser: (user) => set({
    user,
    isAuthenticated: !!user,
    isLoading: false
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setHasHydrated: (state) => set({ _hasHydrated: state }),

  login: async (email: string, password: string) => {
    const response = await api.post<{
      access: string;
      refresh: string;
    }>('/auth/token/', { username: email, password });

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    await get().checkAuth();
  },

  register: async (email: string, password: string, password2: string, nickname: string) => {
    try {
      const response = await api.post<{
        success: boolean;
        data: {
          user: User;
          tokens: {
            access: string;
            refresh: string;
          };
        };
        message: string;
      }>('/auth/register/', { email, password, password2, nickname });

      if (response.data.success) {
        localStorage.setItem('access_token', response.data.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.data.tokens.refresh);
        set({
          user: response.data.data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      }

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string | Record<string, string[]> } } };
      return {
        success: false,
        message: axiosError.response?.data?.message || '회원가입에 실패했습니다.',
      };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isLoading: false, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (!token) {
      set({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get<{ success: boolean; data: User }>('/users/me/');
      set({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      set({ user: null, isLoading: false, isAuthenticated: false });
    }
  },
}));

// 초기화 함수 - 앱 시작시 호출
export const initializeAuth = () => {
  const store = useAuthStore.getState();
  if (!store._hasHydrated) {
    store.setHasHydrated(true);
    store.checkAuth();
  }
};
