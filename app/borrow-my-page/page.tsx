"use client"

import { useState } from "react"
import { PasswordVerification } from "./components/passwordVerification"
import BorrowerMyPage from "./components/borrow-my-page"

export default function Page() {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)

  if (!isPasswordVerified) {
    return <PasswordVerification onVerificationSuccess={() => setIsPasswordVerified(true)} />
  }

  return <BorrowerMyPage />
}