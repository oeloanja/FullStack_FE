"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/button"
import { Check } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/utils/api'

type BankAccount = {
  id: number
  bankName: string
  accountNumber: string
  accountHolder: string
  balance: number
  createdAt: string
  updatedAt: string
}

type UserInfo = {
  email: string
  userName: string
  phone: string
}

export default function BorrowerMyPage({ verificationToken }: { verificationToken: string }) {
  const [activeTab, setActiveTab] = useState<'personal' | 'account'>('personal')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user, userType, token } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refresh = searchParams.get('refresh')

  const fetchUserData = useCallback(async () => {
    if (!user?.userBorrowId || !verificationToken) {
      console.error('사용자 ID 또는 검증 토큰이 없습니다:', { userBorrowId: user?.userBorrowId, verificationToken })
      setError('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      console.log('사용자 정보 요청 시작:', { userBorrowId: user.userBorrowId, verificationToken: verificationToken.slice(0, 10) + '...' })
      const response = await api.get(`/api/v1/user-service/users/borrow/mypage`, {
        params: { userId: user.userBorrowId },
        headers: {
          'Authorization': `Bearer ${verificationToken}`,
          'Content-Type': 'application/json'
        }
      })
      console.log('사용자 정보 응답:', response)

      if (response.status === 200 && response.data) {
        console.log('사용자 정보 성공적으로 받음:', response.data)
        setUserInfo(response.data)
      } else {
        console.error('사용자 정보 응답이 예상과 다릅니다:', response)
        throw new Error('사용자 정보를 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error)
      setError('사용자 정보를 불러오는데 실패했습니다. 네트워크 연결을 확인하고 다시 시도해주세요.')
    }
  }, [user?.userBorrowId, verificationToken])

  const fetchAccounts = useCallback(async () => {
    if (!user?.userBorrowId || userType !== 'borrow') {
      console.error('사용자 인증 실패:', { userBorrowId: user?.userBorrowId, userType })
      setError('사용자 인증에 실패했습니다. 다시 로그인해주세요.')
      setIsLoading(false)
      return
    }

    if (!token) {
      console.error('토큰이 없습니다.')
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      setIsLoading(false)
      return
    }

    try {
      console.log('계좌 정보 요청 시작:', { userBorrowId: user.userBorrowId, token: token.slice(0, 10) + '...' })
      const response = await api.get(`/api/v1/user-service/accounts/borrow`, {
        params: { userId: user.userBorrowId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('계좌 정보 응답:', response)

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log('계좌 정보 성공적으로 받음:', response.data)
        setAccounts(response.data)
      } else {
        console.log('계좌 정보가 없거나 예상과 다릅니다:', response)
        setAccounts([])
      }
      setError(null)
    } catch (err) {
      console.error("계좌 데이터 조회 오류:", err)
      setError('계좌 데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.')
    }
  }, [user?.userBorrowId, userType, token])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await fetchUserData()
      await fetchAccounts()
      setIsLoading(false)
    }
    fetchData()
  }, [fetchUserData, fetchAccounts, refresh])

  const handleDeleteAccount = async (id: number) => {
    if (!user?.userBorrowId) {
      console.error('사용자 ID가 없습니다.')
      return
    }

    if (!token) {
      console.error('토큰이 없습니다.')
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      console.log('계좌 삭제 요청 시작:', { accountId: id, userBorrowId: user.userBorrowId, token: token.slice(0, 10) + '...' })
      const response = await api.put(`/api/v1/user_service/accounts/borrow/${id}/status`, 
        { isDeleted: true },
        {
          params: { userId: user.userBorrowId },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log('계좌 삭제 응답:', response)
      setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id))
    } catch (error) {
      console.error("계좌 삭제 오류:", error)
      setError('계좌 삭제에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">로딩 중...</div>
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => {
          setError(null)
          fetchUserData()
          fetchAccounts()
        }} className="mt-4">
          다시 시도
        </Button>
      </div>
    )
  }

  if (!userInfo || userType !== 'borrow' || !user?.userBorrowId) {
    return (
      <div className="text-center mt-8">
        <p>사용자 정보를 불러올 수 없습니다.</p>
        <Button onClick={() => router.push('/login')} className="mt-4">
          로그인 페이지로 이동
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-5xl font-bold">대출자 마이페이지</h1>
      </div>

      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab('personal')}
          className={`py-2 px-4 ${
            activeTab === 'personal'
              ? 'border-b-2 border-[#23E2C2] text-[#23E2C2]'
              : 'text-gray-500'
          }`}
        >
          개인 정보
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`py-2 px-4 ${
            activeTab === 'account'
              ? 'border-b-2 border-[#23E2C2] text-[#23E2C2]'
              : 'text-gray-500'
          }`}
        >
          계좌 정보
        </button>
      </div>

      {activeTab === 'personal' && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-24 text-gray-600">이메일</span>
              <span>{userInfo.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">이름</span>
              <span>{userInfo.userName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">전화번호</span>
              <span>{userInfo.phone}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/borrow-my-page/change-password" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              비밀번호 변경
            </Link>
            <Link href="/borrow-my-page/change-number" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              전화번호 수정
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-5">
          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <div 
                  key={account.id} 
                  className="border shadow-sm bg-white rounded-2xl p-6 space-y-5"
                >
                  <div className="text-lg font-medium">{account.bankName}</div>
                  <div className="text-gray-600">{account.accountNumber}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Check className="w-4 h-4 mr-1" />
                    계좌주: {account.accountHolder}
                  </div>
                  <Button
                    onClick={() => handleDeleteAccount(account.id)}
                    variant="outline"
                    className="w-full bg-gray-100"
                  >
                    삭제
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex gap-4 place-content-center">
            <Link href="/borrow-my-page/account-register" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              + 계좌 등록
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

