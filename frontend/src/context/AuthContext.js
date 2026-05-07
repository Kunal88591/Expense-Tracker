import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Check if user is logged in on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Setup axios interceptor to include token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const signup = async (name, email, password, confirmPassword) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
        confirmPassword
      });

      const { user: userData, token: newToken } = response.data;
      setUser(userData);
      setToken(newToken);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.details || 'Signup failed';
      setError(errorMsg);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { user: userData, token: newToken } = response.data;
      setUser(userData);
      setToken(newToken);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.details || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    isLoading,
    error,
    signup,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
