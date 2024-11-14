"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserType = 'none' | 'investor' | 'borrower';

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>('none');

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
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