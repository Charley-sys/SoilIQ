import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import AddSoilReading from "./pages/AddSoilReading";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import FarmManagement from "./pages/FarmManagement";
import logo from "./assets/my_logo.jpg";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col shadow-lg fixed h-full">
      {/* Logo + Title */}
      <div className="flex items-center justify-center gap-3 p-6 border-b border-green-700">
        <img
          src={logo}
          alt="SoilIQ Logo"
          className="w-10 h-10 rounded-full object-cover shadow-md"
        />
        <h1 className="text-2xl font-bold tracking-wide">SoilIQ</h1>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="font-semibold">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-green-200 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="flex-grow p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="text-lg">📊</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/add-reading"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="text-lg">➕</span>
          <span>Add Reading</span>
        </Link>

        <Link
          to="/farms"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="text-lg">🏠</span>
          <span>My Farms</span>
        </Link>

        <Link
          to="/profile"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          <span className="text-lg">👤</span>
          <span>Profile</span>
        </Link>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-green-700">
        {user ? (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-red-200 hover:text-red-100"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        ) : (
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>🔑</span>
              <span>Login</span>
            </Link>
          </div>
        )}
        
        <div className="text-xs text-gray-300 text-center mt-4">
          © {new Date().getFullYear()} SoilIQ
        </div>
      </div>
    </aside>
  );
};

// Main App Content
const AppContent = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-reading" 
            element={
              <ProtectedRoute>
                <AddSoilReading />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farms" 
            element={
              <ProtectedRoute>
                <FarmManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;