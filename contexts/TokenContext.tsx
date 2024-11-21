"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface TokenContextType {
  token: string | null
  setToken: (token: string | null) => void
}

const TokenContext = createContext<TokenContextType | undefined>(undefined)

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  )
}

export const useToken = () => {
  const context = useContext(TokenContext)
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider')
  }
  return context
}