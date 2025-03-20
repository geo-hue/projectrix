import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
});

// Flag to prevent duplicate refresh operations
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Queue of failed requests to retry after token refresh
const failedQueue: { 
  resolve: (value: string | PromiseLike<string>) => void; 
  reject: (reason?: any) => void;
}[] = [];

// Process the queue of failed requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  
  // Clear the queue
  failedQueue.splice(0, failedQueue.length);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, add this request to the queue
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          // If the refresh fails, reject the request
          return Promise.reject(err);
        }
      }
      
      // Mark that we're retrying and refreshing the token
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to get a refresh function from window (injected by AuthContext)
        const refreshFn = (window as any).refreshAuthToken;
        
        if (typeof refreshFn === 'function') {
          refreshPromise = refreshFn();
          const newToken = await refreshPromise;
          
          if (newToken) {
            // Update the header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            // Process any queued requests
            processQueue(null, newToken);
            // Return the retried request
            return api(originalRequest);
          } else {
            // If we couldn't get a new token, handle the error
            processQueue(new Error('Failed to refresh token'));
            handleAuthError();
            return Promise.reject(error);
          }
        } else {
          // If the refresh function doesn't exist, handle the error
          processQueue(new Error('Refresh function not available'));
          handleAuthError();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If token refresh fails
        processQueue(refreshError);
        handleAuthError();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Function to handle authentication errors
const handleAuthError = () => {
  // Display notification about session expiration
  toast.error('Your session has expired. Please login again.', {
    duration: 5000,
    position: 'top-center'
  });
  
  // Remove token from localStorage
  localStorage.removeItem('token');
  
  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = '/';
  }, 1500);
};

// Export the global token refresh function for use by interceptors
if (typeof window !== 'undefined') {
  (window as any).refreshAuthToken = async () => {
    try {
      // Get auth context's refreshToken function
      const authContext = (window as any).__authContext;
      if (authContext && typeof authContext.refreshToken === 'function') {
        return await authContext.refreshToken();
      }
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };
}

export default api;