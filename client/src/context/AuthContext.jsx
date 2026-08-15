import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check auth state on load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data.data);
        } catch (error) {
          console.error('Failed to load user session:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const { token: userToken, ...userData } = res.data.data;
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await registerUser(formData);
    const { token: userToken, ...userData } = res.data.data;
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
