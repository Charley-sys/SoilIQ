import React from 'react';

const ProtectedRoute = ({ children }) => {
  // Remove all authentication checks - allow immediate access
  return children;
};

export default ProtectedRoute;