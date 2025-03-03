'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Public routes that don't require authentication
const publicRoutes = ['/', '/about', '/pricing', '/ideas', '/generate',];

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith('/ideas/') ||
                       pathname.startsWith('/about/') ||
                       pathname.startsWith('/generate');

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