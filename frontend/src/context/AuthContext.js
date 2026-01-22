import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // console.log('Checking auth with token');
        const response = await authAPI.getProfile();
        setUser(response.data.data);
      } catch (error) {
        // console.error('Auth check failed:', error);
        // token expired or invalid, remove it
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    // tried storing user in state only but needed token for api calls
    // sessionStorage.setItem('token', token); // switched to localStorage
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // window.location.href = '/login'; // navigate is handled by component
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
