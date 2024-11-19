"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type UserType = 'borrow' | 'invest' | null;

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Try to get userType from localStorage on mount
    const storedUserType = localStorage.getItem('userType') as UserType;
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  // Reset userType when user logs out
  useEffect(() => {
    if (!user) {
      setUserType(null);
      localStorage.removeItem('userType');
    }
  }, [user]);

  const updateUserType = (type: UserType) => {
    console.log('Updating userType to:', type); // 디버깅용
    setUserType(type);
    if (type) {
      localStorage.setItem('userType', type);
    } else {
      localStorage.removeItem('userType');
    }
  };

  return (
    <UserContext.Provider value={{ userType, setUserType: updateUserType }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};