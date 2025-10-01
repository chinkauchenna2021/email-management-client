// components/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { token, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // Set up axios interceptor for token refresh if needed
    const interceptor = api.interceptors.response.use(
      (response: any) => response,
      async (error:any) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Try to refresh token or logout
          logout();
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return <>{children}</>;
}