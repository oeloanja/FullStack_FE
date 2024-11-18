"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type UserType = 'none' | 'investor' | 'borrower';

interface UserContextType {
  userType: UserType;
  userBorrowId: number | null;
  login: (type: 'investor' | 'borrower', id: number) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>('none');
  const [userBorrowId, setUserBorrowId] = useState<number | null>(null);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 불러오기
    const storedUserType = localStorage.getItem('userType') as UserType;
    const storedUserBorrowId = localStorage.getItem('userBorrowId');
    if (storedUserType) {
      setUserType(storedUserType);
    }
    if (storedUserBorrowId) {
      setUserBorrowId(parseInt(storedUserBorrowId, 10));
    }
  }, []);

  const login = (type: 'investor' | 'borrower', id: number) => {
    setUserType(type);
    setUserBorrowId(id);
    localStorage.setItem('userType', type);
    localStorage.setItem('userBorrowId', id.toString());
  };

  const logout = () => {
    setUserType('none');
    setUserBorrowId(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('userBorrowId');
  };

  return (
    <UserContext.Provider value={{ userType, userBorrowId, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser는 UserProvider 내에서 사용되어야 합니다');
  }
  return context;
};