'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Public routes that don't require authentication
const publicRoutes = ['/', '/about', '/pricing', '/ideas', '/generate', 'coming-soon'];

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, loading } = useAuth();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Store auth context in window for the API interceptor
      (window as any).__authContext = {
        refreshToken: auth.refreshToken,
        logout: auth.logout
      };
      
      // Clean up on unmount
      return () => {
        delete (window as any).__authContext;
      };
    }
  }, [auth.refreshToken, auth.logout]);
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith('/ideas/') ||
                       pathname.startsWith('/about/') ||
                       pathname.startsWith('/generate') ||
                       pathname.startsWith('/terms') ||
                       pathname.startsWith('/policy')||
                       (pathname.startsWith('/profile/') && pathname !== '/profile')||
                       (pathname.startsWith('/projects/') && pathname !== '/projects') ||
                       pathname.startsWith('/coming-soon');
                       ;

  useEffect(() => {
    // Only redirect if not a public route, authentication check is completed, and user is not authenticated
    if (!isPublicRoute && !loading && !isAuthenticated) {
      toast.error('Please login to access this page');
      router.push('/');
    }
  }, [isAuthenticated, loading, router, pathname, isPublicRoute]);

  // For protected routes, show loading or nothing until authentication is confirmed
  if (!isPublicRoute && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-current border-t-transparent text-primary"></div>
      </div>
    );
  }

  // For protected routes, only render children if authenticated
  if (!isPublicRoute && !isAuthenticated) {
    return null;
  }

  
  // For public routes or authenticated users, render children
  return <>{children}</>;
}