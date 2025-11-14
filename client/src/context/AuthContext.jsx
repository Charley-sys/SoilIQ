// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js'; // Make sure this path is correct

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('soilIQToken');
      const savedUser = localStorage.getItem('soilIQUser');
      
      if (token && savedUser) {
        // Set user immediately for better UX
        setUser(JSON.parse(savedUser));
        
        // Verify token is still valid
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data.user);
        } else {
          // Token invalid, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

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

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    localStorage.removeItem('soilIQUser');
    localStorage.removeItem('soilIQToken');
  };

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