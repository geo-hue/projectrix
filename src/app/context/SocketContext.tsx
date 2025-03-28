// src/app/context/SocketContext.tsx
// Updated version with commented out logs
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Activity } from '../api/activityApiSlice';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  activities: Activity[];
  clearNewActivities: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  activities: [],
  clearNewActivities: () => {}
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const { user, isAuthenticated, refreshToken } = useAuth();
  
  const connectSocket = async () => {
    // Clean up any existing connection
    if (socket) {
      socket.disconnect();
    }
    
    // Only create socket if user is authenticated
    if (!isAuthenticated || !user) {
      setSocket(null);
      setConnected(false);
      return;
    }
    
    try {
      // Get a fresh token when connecting
      const token = await refreshToken();
      
      if (!token) {
        // console.error('Failed to get token for socket connection');
        return;
      }
      
      // Initialize Socket.io connection
      const socketIo = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      // Socket event handlers
      socketIo.on('connect', () => {
        // console.log('Socket connected!');
        setConnected(true);
      });

      socketIo.on('disconnect', () => {
        // console.log('Socket disconnected!');
        setConnected(false);
      });

      socketIo.on('connect_error', (error) => {
        // console.error('Socket connection error:', error);
        setConnected(false);
        
        // Handle auth errors
        if (error.message.includes('Authentication')) {
          // Try to refresh token and reconnect
          setTimeout(connectSocket, 5000);
        }
      });

      // Handle new activity notifications
      socketIo.on('new_activity', (data) => {
        const newActivity = data.activity;
        
        // Add the new activity to our state
        setActivities(prev => [newActivity, ...prev]);
        
        // Show a toast notification
        toast(
          <div className="flex flex-col">
            <span className="font-semibold text-sm mb-1">New Notification</span>
            <span className="text-xs">{newActivity.message}</span>
          </div>,
          {
            icon: '🔔',
            position: 'top-right',
            duration: 5000
          }
        );
      });

      setSocket(socketIo);
    } catch (error) {
      // console.error('Error setting up socket connection:', error);
    }
  };

  // Connect/disconnect socket when authentication changes
  useEffect(() => {
    connectSocket();
    
    // Cleanup on unmount or auth change
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user?._id]);
  
  // Set up a heartbeat to keep connection alive
  useEffect(() => {
    if (!socket) return;
    
    const heartbeatInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('heartbeat');
      } else if (isAuthenticated) {
        // Try to reconnect if authenticated but disconnected
        connectSocket();
      }
    }, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [socket, isAuthenticated]);

  // Function to clear new activities
  const clearNewActivities = () => {
    setActivities([]);
  };

  return (
    <SocketContext.Provider value={{ socket, connected, activities, clearNewActivities }}>
      {children}
    </SocketContext.Provider>
  );
};