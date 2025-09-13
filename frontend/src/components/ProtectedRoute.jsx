import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import { useTheme } from '../contexts/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isDarkMode } = useTheme();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;