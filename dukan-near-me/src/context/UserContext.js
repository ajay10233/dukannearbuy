'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initiateSocket } from '@/lib/socket';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserContext = createContext();

// 🔹 Function to fetch user details

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchUserDetails = async () => {
    console.log('Fetching user details...');
    try {
      const res = await axios.get('/api/users/me');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  };

  // 🔹 Function to connect socket
  const connectSocket = (userId) => {
    try {
      const socketInstance = initiateSocket();
      console.log("Connecting to socket: ",userId)
      if (userId) {
        socketInstance.emit('join', userId);
      }
      return socketInstance;
    } catch (err) {
      console.error('Socket connection error:', err);
      return null;
    }
  };



  useEffect(() => {
    const initialize = async () => {
      const userData = await fetchUserDetails();
      if (userData) {
        setUser(userData);
        const socketInstance = connectSocket(userData.id);
        setSocket(socketInstance);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initialize();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);


  useEffect(() => {
    if (!socket) return;

    socket.on("receiveNotification", ({message }) => {
      console.log("🔔 Notification received:", message);
      toast.success(message);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, [socket]);

  return (
    <UserContext.Provider value={{ user, socket, loading, fetchUserDetails, connectSocket }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
