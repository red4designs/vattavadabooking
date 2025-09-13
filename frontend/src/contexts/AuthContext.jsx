import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin credentials
  const ADMIN_CREDENTIALS = {
    loginId: 'robindavis143',
    password: 'Godiloveu@1292'
  };

  // Check if user is already authenticated on app load
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (loginId, password) => {
    if (loginId === ADMIN_CREDENTIALS.loginId && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid login credentials' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;