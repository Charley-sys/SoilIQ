// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Check Authentication Status
  // -------------------------------
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('soilIQToken');
      const savedUser = localStorage.getItem('soilIQUser');

      console.log('🔐 Auth check - Token exists:', !!token);
      console.log('🔐 Auth check - User exists:', !!savedUser);

      if (token && savedUser) {
        setUser(JSON.parse(savedUser));

        console.log('🔐 Verifying token...');
        const response = await authAPI.getProfile();
        console.log('🔐 Profile response:', response);

        if (response.success) {
          setUser(response.data.user);
          console.log('✅ Token valid, user authenticated');
        } else {
          console.log('❌ Token invalid, logging out');
          logout();
        }
      } else {
        console.log('🔐 No token or user found');
      }
    } catch (error) {
      console.error('🔐 Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // -------------------------------
  // LOGIN
  // -------------------------------
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', email);
      const response = await authAPI.login(email, password);
      console.log('📨 Login API response:', response);

      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('soilIQUser', JSON.stringify(response.data.user));
        localStorage.setItem('soilIQToken', response.token);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  // -------------------------------
  // REGISTER
  // -------------------------------
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('soilIQUser', JSON.stringify(response.data.user));
        localStorage.setItem('soilIQToken', response.token);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('soilIQUser');
    localStorage.removeItem('soilIQToken');
  };

  // -------------------------------
  // LOADING SCREEN
  // -------------------------------
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h2>Loading SoilIQ...</h2>
      </div>
    );
  }

  // -------------------------------
  // CONTEXT PROVIDER
  // -------------------------------
  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </AuthContext.Provider>
  );
};
