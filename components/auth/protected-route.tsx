'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run redirect logic after client-side initialization
    if (!isClient || isLoading) return;

    // If not authenticated and not already on login page, redirect to login
    if (!isAuthenticated && pathname !== '/auth/login') {
      router.push('/auth/login');
      return;
    }

    // If authenticated and on login page, redirect to home
    if (isAuthenticated && pathname === '/auth/login') {
      router.push('/');
      return;
    }

    // Role-based protection (optional)
    if (requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, router, pathname, isLoading, isClient, requiredRole]);

  // Show loading while checking authentication
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Role check
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}