'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // 첫 마운트시 인증 상태 확인
    if (!store._hasHydrated) {
      store.setHasHydrated(true);
      store.checkAuth();
    }
  }, [store]);

  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
  };
}
