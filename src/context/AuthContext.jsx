import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('maco_user');
      if (!storedUser) return null;
      
      const parsed = JSON.parse(storedUser);
      // Normalize 'user' role to 'customer' for compatibility and to prevent loops
      if (parsed && parsed.role === 'user') {
          parsed.role = 'customer';
          localStorage.setItem('maco_user', JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const login = React.useCallback((role, token) => {
    const userData = { isAuthenticated: true, role, token };
    setUser(userData);
    localStorage.setItem('maco_user', JSON.stringify(userData));
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem('maco_user');
  }, []);

  const contextValue = React.useMemo(() => ({
    user,
    login,
    logout
  }), [user, login, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
