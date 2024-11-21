"use client"

import { createContext, useState, useEffect, ReactNode } from "react"

interface TokenContextType {
  token: string | null
  setToken: (token: string | null) => void
  clearToken: () => void
}

export const TokenContext = createContext<TokenContextType | undefined>(undefined)

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token')
    if (storedToken) {
      setTokenState(storedToken)
    }
  }, [])

  const setToken = (newToken: string | null) => {
    setTokenState(newToken)
    if (newToken) {
      sessionStorage.setItem('token', newToken)
    } else {
      sessionStorage.removeItem('token')
    }
  }

  const clearToken = () => {
    setTokenState(null)
    sessionStorage.removeItem('token')
  }

  return (
    <TokenContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </TokenContext.Provider>
  )
}