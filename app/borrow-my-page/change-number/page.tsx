"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/utils/api"
import { Toast } from "@/components/toast"
import { useRouter } from 'next/navigation'
import { PasswordVerification } from "../components/passwordVerification"

export default function ChangePhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [verificationToken, setVerificationToken] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('verificationToken')
    if (token) {
      setVerificationToken(token)
    }
  }, [])

  const handleVerificationSuccess = (token: string) => {
    sessionStorage.setItem('verificationToken', token)
    setVerificationToken(token)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setToast(null)

    if (!verificationToken || !user?.userBorrowId) {
      setToast({ message: "인증 정보가 없습니다. 다시 로그인해주세요.", type: "error" })
      setIsLoading(false)
      return
    }

    try {
      const response = await api.put(
        "/api/v1/user-service/users/borrow/phone",
        { phone: phoneNumber },
        {
          params: { userId: user.userBorrowId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${verificationToken}`
          }
        }
      )

      if (response.status === 200) {
        setToast({ message: "전화번호가 성공적으로 변경되었습니다.", type: "success" })
        setPhoneNumber("")
        sessionStorage.removeItem('verificationToken')
        
        setTimeout(() => {
          router.push('/borrow-my-page')
        }, 2000)
      } else {
        throw new Error('전화번호 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error("전화번호 변경 오류:", error)
      setToast({ message: "전화번호 변경에 실패했습니다. 다시 시도해주세요.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!verificationToken) {
    return <PasswordVerification onVerificationSuccess={handleVerificationSuccess} />
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">전화번호 변경</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="phone-number" className="text-sm text-gray-600">새 전화번호</label>
          <input
            id="phone-number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="새로운 전화번호를 입력해주세요. (예: 010-1234-5678)"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
            pattern="^\d{2,3}-\d{3,4}-\d{4}$"
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12"
          disabled={isLoading}
        >
          {isLoading ? "처리 중..." : "전화번호 변경 완료"}
        </Button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

