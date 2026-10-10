import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setToken(data.token);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        restaurantId: data.restaurantId,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authApi.register(userData);
      setToken(data.token);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        restaurantId: data.restaurantId,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role) => {
    if (role === 'CUSTOMER') {
      return await login('customer@foodie.com', 'password123');
    } else if (role === 'RESTAURANT_ADMIN') {
      return await login('admin@foodie.com', 'password123');
    } else if (role === 'DELIVERY_PERSONNEL') {
      return await login('delivery@foodie.com', 'password123');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      register,
      quickLogin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
