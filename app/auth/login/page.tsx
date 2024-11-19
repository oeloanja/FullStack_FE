"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Toast } from "@/components/toast"
import { useAuth } from "@/contexts/AuthContext"
import { useUser } from "@/contexts/UserContext"

interface LoginResponse {
  id: string;  // 서버에서 'id'로 보내는 경우를 처리
  userId: string;  // 서버에서 'userId'로 보내는 경우를 처리
  email: string;
  userName: string;
  phone: string;
  creditRating: string | null;
}

async function loginUser(email: string, password: string, userType: 'borrow' | 'invest'): Promise<LoginResponse> {
  console.log(`Attempting to login user: ${email}, type: ${userType}`);
  const response = await fetch(`http://localhost:8085/api/users/${userType}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  console.log(`Login API response status: ${response.status}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Login API error:', errorData);
    throw new Error(errorData.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
  }

  const data = await response.json();
  console.log('Login API response data:', data);
  
  // id나 userId 중 하나가 반드시 있어야 함
  if (!data.userId && !data.id) {
    throw new Error('서버 응답에 userId가 없습니다.');
  }

  // id를 userId로 변환하여 일관성 유지
  return {
    ...data,
    userId: data.userId || data.id
  };
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
  const { setUserType } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userType = activeTab === 'borrower' ? 'borrow' : 'invest'
      console.log('Attempting login with type:', userType);
      
      const response = await loginUser(formData.email, formData.password, userType)
      console.log('Login response:', response);

      // userId가 문자열인지 확인
      const userId = String(response.userId)
      if (!userId) {
        throw new Error('유효하지 않은 사용자 ID입니다.');
      }
      
      login(
        userId,
        userType,
        {
          userId,
          email: response.email,
          userName: response.userName,
          phone: response.phone
        }
      )
      
      setUserType(userType)
      
      setToast({ message: '로그인에 성공했습니다.', type: 'success' })
      
      setTimeout(() => {
        console.log('Redirecting to:', userType === 'borrow' ? '/borrow-my-page' : '/invest-my-page');
        router.push(userType === 'borrow' ? '/borrow-my-page' : '/invest-my-page')
      }, 1000)
    } catch (error) {
      console.error('Login error:', error)
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
              아이디/PW가 기억나지 않으신가요? <Link 
                href="/forgot-password" 
                className="text-sm text-[#23E2C2]"
              >ID/PW 찾기
              </Link>
            </div>
          </form>
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