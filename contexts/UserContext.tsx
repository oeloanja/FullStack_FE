"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

type UserType = 'borrow' | 'invest' | null

interface UserContextType {
  userType: UserType
  userBorrowId: number | null
  setUserType: (type: UserType) => void
  setUserBorrowId: (id: number | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType>(null)
  const [userBorrowId, setUserBorrowId] = useState<number | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as UserType
    const storedUserBorrowId = localStorage.getItem('userBorrowId')
    
    if (storedUserType) {
      setUserType(storedUserType)
    }
    if (storedUserBorrowId) {
      setUserBorrowId(Number(storedUserBorrowId))
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setUserType(null)
      setUserBorrowId(null)
      localStorage.removeItem('userType')
      localStorage.removeItem('userBorrowId')
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

  const updateUserBorrowId = (id: number | null) => {
    console.log('사용자 대출 ID 업데이트:', id)
    setUserBorrowId(id)
    if (id !== null) {
      localStorage.setItem('userBorrowId', id.toString())
    } else {
      localStorage.removeItem('userBorrowId')
    }
  }

  return (
    <UserContext.Provider 
      value={{ 
        userType, 
        userBorrowId,
        setUserType: updateUserType,
        setUserBorrowId: updateUserBorrowId
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