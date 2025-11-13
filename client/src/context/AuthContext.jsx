// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('soilIQUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    console.log('AuthContext loaded, user:', savedUser);
  }, []);

  const login = (userData) => {
    console.log('Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('soilIQUser', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('soilIQUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </AuthContext.Provider>
  );
};