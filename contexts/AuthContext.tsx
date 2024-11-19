'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  userId: string
  email: string
  userName: string
  phone: string
}

interface AuthContextType {
  userId: string | null
  userType: 'invest' | 'borrow' | null
  user: User | null
  login: (userId: string, userType: 'invest' | 'borrow', user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const defaultContext: AuthContextType = {
  userId: null,
  userType: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
}

const AuthContext = createContext<AuthContextType>(defaultContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [userType, setUserType] = useState<'invest' | 'borrow' | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedUserType = localStorage.getItem('userType') as 'invest' | 'borrow' | null
    const storedUser = localStorage.getItem('user')

    if (storedUserId && storedUserType && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUserId(storedUserId)
        setUserType(storedUserType)
        setUser(parsedUser)
        setIsAuthenticated(true)
        console.log('Auth state restored:', { storedUserId, storedUserType, parsedUser })
      } catch (error) {
        console.error('Error restoring auth state:', error)
        localStorage.removeItem('userId')
        localStorage.removeItem('userType')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = (newUserId: string, newUserType: 'invest' | 'borrow', newUser: User) => {
    console.log('Login called with:', { newUserId, newUserType, newUser })
    
    if (!newUserId || typeof newUserId !== 'string') {
      console.error('Invalid userId provided:', newUserId)
      return
    }

    setUserId(newUserId)
    setUserType(newUserType)
    setUser(newUser)
    setIsAuthenticated(true)
    
    localStorage.setItem('userId', newUserId)
    localStorage.setItem('userType', newUserType)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    console.log('Auth state updated successfully:', { newUserId, newUserType, newUser })
  }

  const logout = () => {
    console.log('Logout called')
    setUserId(null)
    setUserType(null)
    setUser(null)
    setIsAuthenticated(false)
    
    localStorage.removeItem('userId')
    localStorage.removeItem('userType')
    localStorage.removeItem('user')
  }

  const value = {
    userId,
    userType,
    user,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}