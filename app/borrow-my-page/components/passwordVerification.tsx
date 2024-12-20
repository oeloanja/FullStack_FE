"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { useAuth } from "@/contexts/AuthContext"
import api from '@/utils/api'

interface PasswordVerificationProps {
  onVerificationSuccess: (verificationToken: string) => void
}

export function PasswordVerification({ onVerificationSuccess }: PasswordVerificationProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user, token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!user?.userBorrowId) {
      setError("사용자 ID가 없습니다. 다시 로그인해주세요.");
      setIsLoading(false);
      return;
    }

    console.log('Sending request with userId:', user.userBorrowId);

    try {
      const response = await api.post(`/api/v1/user-service/users/borrow/verify-password`, {
        password: password
      }, {
        params: { userId: user.userBorrowId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 200 && response.data.verificationToken) {
        onVerificationSuccess(response.data.verificationToken)
      } else {
        setError("비밀번호가 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("비밀번호 확인 오류:", error)
      setError("비밀번호 확인에 실패했습니다. 다시 시도해 주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-32">
      <div className="max-w-md mx-auto mt-8 pt-10 border shadow-sm bg-white rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">비밀번호 확인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-3 block w-full border-gray-300 focus:border-[#23E2C2] focus:ring focus:ring-[#23E2C2] focus:ring-opacity-50 border shadow-sm bg-white rounded-2xl p-6"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
          >
            {isLoading ? '확인 중...' : '확인'}
          </Button>
        </form>
      </div>
    </div>
  )
}

