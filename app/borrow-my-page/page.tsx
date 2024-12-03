"use client"

import { useState, useEffect } from "react"
import { PasswordVerification } from "./components/passwordVerification"
import BorrowerMyPage from "./components/borrow-my-page"

export default function Page() {
  const [verificationToken, setVerificationToken] = useState<string | null>(null)

  const handleVerificationSuccess = (newToken: string) => {
    sessionStorage.setItem('verificationToken', newToken)
    setVerificationToken(newToken)
  }

  useEffect(() => {
    const storedToken = sessionStorage.getItem('verificationToken')
    if (storedToken) {
      setVerificationToken(storedToken)
    }
  }, [])

  if (!verificationToken) {
    return <PasswordVerification onVerificationSuccess={handleVerificationSuccess} />
  }

  return <BorrowerMyPage verificationToken={verificationToken} />
}

