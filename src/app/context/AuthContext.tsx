'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, githubProvider } from '../utils/firebase';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { toast } from 'sonner';

// Define user type
export type UserData = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  githubId: string;
  username: string;
  skills: string[];
  projectIdeasLeft?: number;
  projectsGenerated?: number;
  createdAt?: string;
  role?: string;
};

// Define context type
type AuthContextType = {
  user: UserData | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthenticated: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshUserData: async () => {},
  isAuthenticated: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to get user data from backend
  const fetchUserData = async (token: string) => {
    try {
      // Set token in localStorage for API interceptor
      localStorage.setItem('token', token);
      
      // Call backend to authenticate and get user data
      const response = await api.post('/auth/github', { token });
      setUser(response.data.user);
      
      // Set a timer to auto-refresh the token
      const expiresIn = response.data.tokenExpiresIn || 86400; // 24 hours in seconds
      
      // Schedule token refresh 30 minutes before expiration
      const refreshTime = (expiresIn - 1800) * 1000; // Convert to milliseconds
      setTimeout(() => refreshToken(), refreshTime);
      
      return response.data.user;
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to authenticate';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };
  
  // Function to refresh the Firebase token
  const refreshToken = async () => {
    try {
      if (firebaseUser) {
        // Force token refresh
        const token = await firebaseUser.getIdToken(true);
        localStorage.setItem('token', token);
        console.log('Token refreshed successfully');
        
        // Also refresh user data from backend
        await refreshUserData();
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
    }
  };

  // Function to refresh user data from backend
  const refreshUserData = async () => {
    try {
      if (!user) return;
      
      const response = await api.get('/auth/refresh');
      setUser(response.data.user);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  // Login function
  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign in with GitHub popup
      const result = await signInWithPopup(auth, githubProvider);
      
      // Get the token
      const token = await result.user.getIdToken();
      
      // Fetch user data from backend
      await fetchUserData(token);
      
      toast.success('Logged in successfully');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // If we have a user, call the backend logout
      if (user) {
        await api.post('/auth/logout');
      }
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear user data
      setUser(null);
      
      toast.success('Logged out successfully');
      router.push('/');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setLoading(true);
        
        if (currentUser) {
          setFirebaseUser(currentUser);
          
          // If we don't have user data yet, fetch it
          if (!user) {
            const token = await currentUser.getIdToken();
            await fetchUserData(token);
          }
        } else {
          // User is signed out
          setFirebaseUser(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Value to provide in context
  const value = {
    user,
    firebaseUser,
    loading,
    error,
    login,
    logout,
    refreshUserData,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};