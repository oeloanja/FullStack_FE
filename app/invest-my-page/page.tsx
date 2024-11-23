"use client"

import { useState, useEffect } from "react"
import { PasswordVerification } from "./components/passwordVerification"
import InvestorMyPage from "./components/invest-my-page"

export default function Page() {
  const [verificationToken, setVerificationToken] = useState<string | null>(null)

  const handleVerificationSuccess = (token: string) => {
    sessionStorage.setItem('verificationToken', token)
    setVerificationToken(token)
  }

  useEffect(() => {
    const token = sessionStorage.getItem('verificationToken')
    if (token) {
      setVerificationToken(token)
    }
  }, [])

  if (!verificationToken) {
    return <PasswordVerification onVerificationSuccess={handleVerificationSuccess} />
  }

  return <InvestorMyPage verificationToken={verificationToken} />
}

