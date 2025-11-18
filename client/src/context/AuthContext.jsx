// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always true for demo

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Set demo user if none exists
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: 'visitor@soiliq.com',
        name: 'SoilIQ Visitor',
        role: 'viewer'
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
    setIsAuthenticated(true);
  }, []);

  const value = {
    user,
    isAuthenticated,
    login: () => Promise.resolve(true), // No-op for demo
    logout: () => {
      // Don't actually log out, just refresh the demo user
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        email: 'visitor@soiliq.com',
        name: 'SoilIQ Visitor',
        role: 'viewer'
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      console.log('Demo user refreshed');
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};