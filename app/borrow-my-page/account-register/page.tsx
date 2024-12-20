"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext"
import api from '@/utils/api'

const banks = ["토스뱅크", "신한은행", "국민은행", "우리은행", "하나은행", "농협은행"]

export default function AccountRegistration() {
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { user, token } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!user?.userBorrowId || !user.userName) {
      setError("인증 정보를 찾을 수 없습니다. 다시 로그인해 주세요.")
      setIsLoading(false)
      return
    }

    if (!selectedBank) {
      setError("은행을 선택해 주세요.")
      setIsLoading(false)
      return
    }

    if (!token) {
      setError("인증 토큰이 없습니다. 다시 로그인해 주세요.")
      setIsLoading(false)
      return
    }

    try {
      await api.post(`/api/v1/user-service/accounts/borrow`, 
        {
          bankName: selectedBank,
          accountNumber,
          accountHolder: user.userName
        },
        {
          params: { userId: user.userBorrowId },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      router.push('/borrow-my-page')
    } catch (error) {
      console.error("계좌 등록 오류:", error)
      setError("계좌 등록에 실패했습니다. 다시 시도해 주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">계좌 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="bank-select" className="block text-sm font-medium text-gray-700">
            은행 선택
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full px-4 py-2 bg-[#23E2C2] text-white rounded-md flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedBank || "은행을 선택해주세요"}
              <ChevronDown className="h-5 w-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedBank(bank)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
            계좌번호
          </label>
          <input
            id="account-number"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="계좌번호를 입력해 주세요."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            예금주
          </label>
          <p className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm">
            {user.userName}
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12"
        >
          {isLoading ? '처리 중...' : '계좌 등록 완료'}
        </Button>
      </form>
    </div>
  )
}

