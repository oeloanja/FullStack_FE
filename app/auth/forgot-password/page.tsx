"use client"

import { useState } from 'react'
import { Button } from "@/components/button"
import api from '@/utils/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await api.post('/api/v1/user-service/users/borrow/find-password', {
        email,
        userName,
        phone
      })

      if (response.status === 200) {
        setSuccessMessage("임시 비밀번호가 이메일로 전송되었습니다.")
        setEmail('')
        setUserName('')
        setPhone('')
      }
    } catch (error) {
      console.error("비밀번호 찾기 오류:", error)
      setError("입력하신 정보와 일치하는 계정을 찾을 수 없습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">임시 비밀번호 발급</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="전화번호를 입력해주세요"
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호를 입력해주세요"
                required
                pattern="^\d{2,3}-\d{3,4}-\d{4}$"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-500 text-sm text-center">
              {successMessage}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
          >
            {isLoading ? '처리 중...' : '임시 비밀번호 발급'}
          </Button>
        </form>
      </div>
    </div>
  )
}

