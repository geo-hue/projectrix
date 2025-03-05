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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
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

    // Initialize Socket.io connection
    const token = localStorage.getItem('token');
    const socketIo = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Socket event handlers
    socketIo.on('connect', () => {
      console.log('Socket connected!');
      setConnected(true);
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected!');
      setConnected(false);
    });

    socketIo.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
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

    // Cleanup on unmount
    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
  }, [isAuthenticated, user]);

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