import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import LoginReminder from './components/LoginReminder';

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  user_Id: string;
  user_Name: string;
  role: string;
}

interface ProtectedPageProps {
  allowedRoles: string[];
  children?: ReactNode;
}

const useProtectedPage = (allowedRoles: string[]) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user`, { withCredentials: true });

        if (response.status === 200) {
          setIsAuthenticated(true);
          const userFromStorage = localStorage.getItem('user');
          if (userFromStorage) {
            const parsedUser: User = JSON.parse(userFromStorage);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoginReminder/>;
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return false;
    
  }

  return null;
};

export default useProtectedPage;
