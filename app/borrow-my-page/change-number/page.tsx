"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { useToken } from "@/contexts/TokenContext"
import { useUser } from "@/contexts/UserContext"
import api from "@/utils/api"
import { Toast } from "@/components/toast"
import { useRouter } from 'next/navigation'

export default function ChangePhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const { token } = useToken()
  const { userBorrowId } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setToast(null)

    if (!token || !userBorrowId) {
      setToast({ message: "인증 정보가 없습니다. 다시 로그인해주세요.", type: "error" })
      setIsLoading(false)
      return
    }

    try {
      const response = await api.put(
        "/api/v1/user_service/users/borrow/phone",
        { phone: phoneNumber },
        {
          params: { userId: userBorrowId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        setToast({ message: "전화번호가 성공적으로 변경되었습니다.", type: "success" })
        setPhoneNumber("")
        
        // 즉시 리다이렉션하지 않고 사용자에게 성공 메시지를 보여줍니다.
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

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">전화번호 변경</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="phone-number" className="sr-only">전화번호</label>
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