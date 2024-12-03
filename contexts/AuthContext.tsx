"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/utils/api';

interface User {
  id: number;
  email: string;
  userName: string;
  phone: string;
  userBorrowId?: number;
  userInvestId?: number;
}

interface AuthContextType {
  user: User | null;
  userType: 'borrow' | 'invest' | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userType: 'borrow' | 'invest', userData: User) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';
const USER_TYPE_KEY = 'authUserType';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'borrow' | 'invest' | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedUserType = localStorage.getItem(USER_TYPE_KEY) as 'borrow' | 'invest' | null;

    if (storedToken && storedUser && storedUserType) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserType(storedUserType);
        setTokenState(storedToken);
        setIsAuthenticated(true);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_TYPE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const login = (newToken: string, newUserType: 'borrow' | 'invest', userData: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(USER_TYPE_KEY, newUserType);

    setUser(userData);
    setUserType(newUserType);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_TYPE_KEY);

    setUser(null);
    setUserType(null);
    setToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, userType, token, isAuthenticated, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

