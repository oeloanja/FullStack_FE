"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { useRouter } from 'next/navigation'
import { Toast } from "@/components/toast"
import api from '@/utils/api'
import axios, { AxiosError } from 'axios'

interface SignupResponse {
  success: boolean;
  message?: string;
}

async function registerUser(userData: any): Promise<SignupResponse> {
  try {
    const response = await api.post('/api/v1/user-service/users/invest/signup',
      ({
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        userName: userData.userName,
        phone: userData.phone
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
    });
    
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(errorData || '회원가입 처리 중 오류가 발생했습니다.');
    }

    return { success: true, message: '회원가입이 완료되었습니다.' };
  } catch (error) {
    console.log(error)
    
    // AxiosError인지 확인
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || '알 수 없는 오류가 발생했습니다.',
      };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message || '알 수 없는 오류가 발생했습니다.' };
    }

    return { success: false, message: '알 수 없는 오류가 발생했습니다.' };
  }
}

export default function InvestorSignup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    userName: "",
    phone: ""
  })
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isTermsAgreed, setIsTermsAgreed] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const router = useRouter()

  const handleSendVerification = async () => {
    setIsLoading(true)
    try {
      const response = await api.post('/api/v1/user-service/users/invest/email/verification', {
        email: formData.email
      });
      if (response.status === 200) {
        setIsVerificationSent(true)
        setToast({ message: '인증 코드가 이메일로 전송되었습니다.', type: 'success' })
      }
    } catch (error) {
      setToast({ message: '인증 코드 전송에 실패했습니다.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)
    try {
      const response = await api.post('/api/v1/user-service/users/invest/email/verify', {
        email: formData.email,
        code: verificationCode
      });
      if (response.status === 200) {
        setIsVerified(true)
        setToast({ message: '이메일이 성공적으로 인증되었습니다.', type: 'success' })
      }
    } catch (error) {
      setToast({ message: '인증 코드가 올바르지 않습니다.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!isVerified) {
        setToast({ message: '이메일 인증을 완료해주세요.', type: 'error' })
        return;
      }

      if (formData.password !== formData.passwordConfirm) {
        setToast({ message: '비밀번호가 일치하지 않습니다.', type: 'error' })
        return;
      }

      const result = await registerUser(formData)
      
      if (result.success) {
        setToast({ message: '회원가입이 완료되었습니다.', type: 'success' })
        setTimeout(() => router.push('/auth/login'), 2000)
      } else {
        setToast({ message: result.message || '회원가입에 실패했습니다.', type: 'error' })
      }
    } catch (error) {
      console.error('Registration error:', error)
      setToast({ message: '회원가입 처리 중 오류가 발생했습니다.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 mb-16">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-center">투자자 회원가입</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="이메일을 입력해 주세요."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
                  disabled={isVerificationSent}
                />
                <Button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={isLoading || isVerificationSent}
                  className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-md px-2 py-2 w-full sm:w-auto"
                >
                  인증코드 전송
                </Button>
              </div>
            </div>

            {/* Verification Code */}
            {isVerificationSent && !isVerified && (
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">인증 코드</label>
                <div className="flex gap-2">
                  <input
                    id="verificationCode"
                    type="text"
                    required
                    placeholder="인증 코드를 입력해 주세요."
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                    className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-md px-2"
                  >
                    인증 확인
                  </Button>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                id="password"
                type="password"
                required
                placeholder="비밀번호를 입력해주세요."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                id="passwordConfirm"
                type="password"
                required
                placeholder="비밀번호를 다시 입력해주세요."
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">이름</label>
              <input
                id="userName"
                type="text"
                required
                placeholder="이름을 입력해주세요."
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">전화번호</label>
              <input
                id="phone"
                type="tel"
                required
                placeholder="전화번호를 입력해주세요."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>
            {/* Terms of Service */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    checked={isTermsAgreed}
                    onChange={(e) => setIsTermsAgreed(e.target.checked)}
                    className="rounded border-gray-300 text-[#23E2C2] focus:ring-[#23E2C2]"
                  />
                  <label htmlFor="termsAgreement" className="text-sm text-gray-700">
                    개인정보 취급 위탁에 동의합니다.
                  </label>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-md px-2"
                >
                  전문보기
                </Button>
              </div>
            </div>

            {/* Terms of Service Modal */}
            {showTerms && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">개인정보 취급 위탁 동의</h2>
                  <p className="mb-4">
                    본인 확인 서비스 제공을 위해 개인정보 취급 위탁 동의를 받고자 합니다. 아래 보기에서 동의 여부를 선택해 주세요.
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>수탁자: (주)회사명</li>
                    <li>개인정보 수집 및 이용 목적: 회원가입 등에 필요한 본인확인 서비스 제공</li>
                    <li>수집하는 개인정보 항목: 이름, 연락처</li>
                    <li>개인정보 보유 및 이용 기간: 수집 일로부터 3년</li>
                  </ul>
                  <p className="mb-4">
                    ※ 귀하께서는 동의하지 않을 권리가 있습니다. 동의하지 않을 경우 서비스를 이용할 수 없음을 알려드립니다.
                  </p>
                  <p className="font-bold mb-4">개인정보 취급 위탁에 대해 동의하시나요?</p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => setShowTerms(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2"
                    >
                      닫기
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsTermsAgreed(true);
                        setShowTerms(false);
                      }}
                      className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-md px-4 py-2"
                    >
                      동의
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={isLoading || !isVerified}
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 text-lg rounded-md disabled:opacity-50"
            >
              {isLoading ? '처리중...' : '회원가입 완료'}
            </Button>
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

