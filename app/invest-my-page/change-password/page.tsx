"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/utils/api"
import { Toast } from "@/components/toast"
import { useRouter } from 'next/navigation'
import { PasswordVerification } from "../components/passwordVerification"

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [verificationToken, setVerificationToken] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

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

    if (!verificationToken || !user?.userInvestId) {
      setToast({ message: "인증 정보가 없습니다. 다시 로그인해주세요.", type: "error" })
      setIsLoading(false)
      return
    }

    if (newPassword !== newPasswordConfirm) {
      setToast({ message: "새 비밀번호가 일치하지 않습니다.", type: "error" })
      setIsLoading(false)
      return
    }

    if (!passwordPattern.test(newPassword)) {
      setToast({ message: "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.", type: "error" })
      setIsLoading(false)
      return
    }

    try {
      const response = await api.put(
        "/api/v1/user-service/users/invest/password",
        { currentPassword, newPassword, newPasswordConfirm },
        {
          params: { userId: user.userInvestId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${verificationToken}`
          }
        }
      )

      if (response.status === 200) {
        setToast({ message: "비밀번호가 성공적으로 변경되었습니다.", type: "success" })
        setCurrentPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")
        sessionStorage.removeItem('verificationToken')
        
        setTimeout(() => {
          router.push('/invest-my-page')
        }, 2000)
      } else {
        throw new Error('비밀번호 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error)
      setToast({ message: "비밀번호 변경에 실패했습니다. 다시 시도해주세요.", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!verificationToken) {
    return <PasswordVerification onVerificationSuccess={handleVerificationSuccess} />
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">비밀번호 변경</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="current-password" className="text-sm text-gray-600">현재 비밀번호</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호를 입력해주세요"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="new-password" className="text-sm text-gray-600">새 비밀번호</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력해주세요"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="new-password-confirm" className="text-sm text-gray-600">새 비밀번호 확인</label>
          <input
            id="new-password-confirm"
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            placeholder="새 비밀번호를 다시 입력해주세요"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12"
          disabled={isLoading}
        >
          {isLoading ? "처리 중..." : "비밀번호 변경 완료"}
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

