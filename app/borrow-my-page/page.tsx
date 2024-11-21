"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Check } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { getToken } from '@/utils/auth'

type BankAccount = {
  id: number
  bankName: string
  accountNumber: string
  accountHolder: string
  balance: number
  createdAt: string
  updatedAt: string
}

export default function BorrowerMyPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'account'>('personal')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user, userType } = useAuth()
  const { userBorrowId } = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!userBorrowId || userType !== 'borrow') {
        setError('사용자 인증에 실패했습니다. 다시 로그인해주세요.')
        setIsLoading(false)
        return
      }

      const token = getToken()
      if (!token) {
        setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
        setIsLoading(false)
        return
      }

      try {
        const response = await api.get(`/api/v1/user_service/accounts/borrow`, {
          params: { userId: userBorrowId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.data && Array.isArray(response.data)) {
          setAccounts(response.data)
        } else {
          setAccounts([])
        }
        setError(null)
        setIsLoading(false)
      } catch (err) {
        console.error("계좌 데이터 조회 오류:", err)
        setError('계좌 데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.')
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [userBorrowId, userType])

  const handleDeleteAccount = async (id: number) => {
    if (!userBorrowId) return

    const token = getToken()
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      await api.put(`/api/v1/user_service/accounts/borrow/${id}/status`, 
        { isDeleted: true },
        {
          params: { userId: userBorrowId },
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      )
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
        <Button onClick={() => setError(null)} className="mt-4">
          다시 시도
        </Button>
      </div>
    )
  }

  if (!user || userType !== 'borrow' || !userBorrowId) {
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
              <span>{user.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">이름</span>
              <span>{user.userName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">전화번호</span>
              <span>{user.phone}</span>
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