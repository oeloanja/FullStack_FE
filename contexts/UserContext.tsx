"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

type UserType = 'borrow' | 'invest' | null

interface UserContextType {
  userType: UserType
  userBorrowId: string | null
  userInvestId: string | null
  setUserType: (type: UserType) => void
  setUserBorrowId: (id: string | null) => void
  setUserInvestId: (id: string | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null)
  const [userBorrowId, setUserBorrowId] = useState<string | null>(null)
  const [userInvestId, setUserInvestId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as UserType
    const storedUserBorrowId = localStorage.getItem('userBorrowId')
    const storedUserInvestId = localStorage.getItem('userInvestId')
    
    if (storedUserType) {
      setUserType(storedUserType)
    }
    if (storedUserBorrowId) {
      setUserBorrowId(storedUserBorrowId)
    }
    if (storedUserInvestId) {
      setUserInvestId(storedUserInvestId)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setUserType(null)
      setUserBorrowId(null)
      setUserInvestId(null)
      localStorage.removeItem('userType')
      localStorage.removeItem('userBorrowId')
      localStorage.removeItem('userInvestId')
    }
  }, [user])

  const updateUserType = (type: UserType) => {
    console.log('사용자 타입 업데이트:', type)
    setUserType(type)
    if (type) {
      localStorage.setItem('userType', type)
    } else {
      localStorage.removeItem('userType')
    }
  }

  const updateUserBorrowId = (id: string | null) => {
    console.log('사용자 대출 ID 업데이트:', id)
    setUserBorrowId(id)
    if (id !== null) {
      localStorage.setItem('userBorrowId', id)
    } else {
      localStorage.removeItem('userBorrowId')
    }
  }

  const updateUserInvestId = (id: string | null) => {
    console.log('사용자 투자 ID 업데이트:', id)
    setUserInvestId(id)
    if (id !== null) {
      localStorage.setItem('userInvestId', id)
    } else {
      localStorage.removeItem('userInvestId')
    }
  }

  return (
    <UserContext.Provider 
      value={{ 
        userType, 
        userBorrowId,
        userInvestId,
        setUserType: updateUserType,
        setUserBorrowId: updateUserBorrowId,
        setUserInvestId: updateUserInvestId
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser는 UserProvider 내에서 사용되어야 합니다')
  }
  return context
}