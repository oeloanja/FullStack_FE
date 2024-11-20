"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  userName: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  userType: 'borrow' | 'invest' | null;
  isAuthenticated: boolean;
  login: (token: string, userType: 'borrow' | 'invest', userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const USER_TYPE_KEY = 'userType';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'borrow' | 'invest' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    const storedUserType = localStorage.getItem(USER_TYPE_KEY) as 'borrow' | 'invest' | null;

    if (token && storedUser && storedUserType) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserType(storedUserType);
        setIsAuthenticated(true);
        
        // Debug logs
        console.log('Restored auth state:', {
          user: parsedUser,
          userType: storedUserType,
          token: token
        });
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear invalid data
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(USER_TYPE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const login = (token: string, userType: 'borrow' | 'invest', userData: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(USER_TYPE_KEY, userType);

    setUser(userData);
    setUserType(userType);
    setIsAuthenticated(true);

    // Debug logs
    console.log('Login successful:', {
      user: userData,
      userType: userType,
      token: token
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_TYPE_KEY);

    setUser(null);
    setUserType(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, userType, isAuthenticated, login, logout }}>
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