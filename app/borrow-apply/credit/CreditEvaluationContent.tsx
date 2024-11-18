"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreditEvaluationContent() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/borrow-apply/confirm')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-20">
      <p className="text-[#23E2C2] text-lg">
        신용등급 평가 중<br />
        잠시만 기다려주세요.
      </p>
      
      {/* Loading Spinner */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#23E2C2] rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  )
}