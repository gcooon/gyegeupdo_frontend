'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    // 중복 호출 방지: 컴포넌트 단위에서 1회만 실행
    if (hasChecked.current) return;
    hasChecked.current = true;

    // 토큰이 없으면 API 호출 불필요
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      store.setUser(null);
      return;
    }

    // 이미 인증 상태가 확인된 경우 스킵
    if (store.isAuthenticated && store.user) return;

    // 첫 마운트시에만 인증 상태 확인
    if (!store._hasHydrated) {
      store.setHasHydrated(true);
      store.checkAuth();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
