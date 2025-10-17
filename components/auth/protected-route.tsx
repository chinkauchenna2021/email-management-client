'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for store to rehydrate from localStorage
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if ( !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // if (!isChecking && isAuthenticated) {
    //   router.push('/unauthorized');
    // }
  }, [isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // if (requiredRole && user?.role !== requiredRole) {
  //   return null;
  // }

  return <>{children}</>;
}