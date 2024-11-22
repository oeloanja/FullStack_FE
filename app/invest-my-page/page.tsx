"use client"

import { useState } from "react"
import { PasswordVerification } from "./components/passwordVerification"
import InvestorMyPage from "./components/invest-my-page"

export default function Page() {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)

  if (!isPasswordVerified) {
    return <PasswordVerification onVerificationSuccess={() => setIsPasswordVerified(true)} />
  }

  return <InvestorMyPage />
}