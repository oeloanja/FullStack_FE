"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Toast } from "@/components/toast"
import { useAuth } from "@/contexts/AuthContext"
import api from '@/utils/api'
import { signIn } from "next-auth/react"

interface LoginResponse {
  user: {
    id: number
    email: string
    userName: string
    phone: string
    userBorrowId?: number
    userInvestId?: number
  }
  accessToken: string
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'borrower' | 'investor'>('borrower')
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  async function loginUser(email: string, password: string, userType: 'borrow' | 'invest'): Promise<LoginResponse> {
    try {
      const response = await api.post(`api/v1/user-service/users/${userType}/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })
      return response.data
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setToast(null)

    try {
      const userType = activeTab === 'borrower' ? 'borrow' : 'invest'
      const response = await loginUser(formData.email, formData.password, userType)

      if (response.accessToken) {
        login(response.accessToken, userType, response.user)
        setToast({ message: '로그인에 성공했습니다.', type: 'success' })
        router.push('/')
      } else {
        throw new Error('토큰을 가져오지 못했습니다.')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setToast({ 
        message: error instanceof Error ? error.message : '로그인에 실패했습니다.', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-fit">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-center">로그인</h1>
          
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('borrower')}
              className={`flex-1 py-2 text-center ${
                activeTab === 'borrower'
                  ? 'text-[#23E2C2] border-b-2 border-[#23E2C2]'
                  : 'text-gray-500'
              }`}
            >
              대출자 로그인
            </button>
            <button
              onClick={() => setActiveTab('investor')}
              className={`flex-1 py-2 text-center ${
                activeTab === 'investor'
                  ? 'text-[#23E2C2] border-b-2 border-[#23E2C2]'
                  : 'text-gray-500'
              }`}
            >
              투자자 로그인
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                id="email"
                type="email"
                required
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                id="password"
                type="password"
                required
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 text-lg rounded-md disabled:opacity-50"
            >
              {isLoading ? '처리중...' : '로그인'}
            </Button>

            <div className="text-center">
              <Link 
                href="forgot-password" 
                className="text-sm text-[#AEAEAE]"
              >PW 찾기 |</Link> 
              <Link 
                href="select-type" 
                className="text-sm text-[#AEAEAE]"
              > 회원가입
              </Link>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">간편 로그인</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => signIn("naver")}
                className="flex items-center justify-center w-full px-4 py-3 text-white bg-[#03C75A] rounded-md hover:bg-opacity-90 text-sm"
              >
                Naver 계정으로 로그인
              </button>
              
              <button
                onClick={() => signIn("kakao")}
                className="flex items-center justify-center w-full px-4 py-3 text-gray-900 bg-[#FEE500] rounded-md hover:bg-opacity-90 text-sm"
              >
                Kakao 계정으로 로그인
              </button>
            </div>
          </div>
        </div>
      </main>
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