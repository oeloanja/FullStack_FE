"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Check } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'
import axios from 'axios'

type BankAccount = {
  id: number
  bankName: string
  accountNumber: string
  accountHolder: string
}

export default function BorrowerMyPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'account'>('personal')
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user, logout, userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user?.userId || userType !== 'borrow') {
        setError('사용자 인증에 실패했습니다. 다시 로그인해주세요.')
        setTimeout(() => router.push('/auth/login'), 3000)
        return
      }

      try {
        const response = await axios.get(`http://localhost:8085/api/accounts/borrow?userId=${user.userId}`)
        setAccounts(response.data)
      } catch (err) {
        console.error("Error fetching accounts:", err)
        setError('계좌 정보를 불러오는 데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [user, userType, router])

  const handleDeleteAccount = async (id: number) => {
    try {
      await axios.put(`http://localhost:8085/api/accounts/borrow/${id}/status?userId=${user?.userId}`, { isDeleted: true })
      setAccounts(accounts.filter(account => account.id !== id))
    } catch (error) {
      console.error("Error deleting account:", error)
      setError('계좌 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (isLoading) {
    return <div className="text-center mt-8">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  if (!user || userType !== 'borrow') {
    return <div className="text-center mt-8">사용자 정보를 불러올 수 없습니다.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold">대출자 마이페이지</h1>
        <Button onClick={handleLogout} variant="outline">로그아웃</Button>
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
          계정 정보 관리
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`py-2 px-4 ${
            activeTab === 'account'
              ? 'border-b-2 border-[#23E2C2] text-[#23E2C2]'
              : 'text-gray-500'
          }`}
        >
          계좌 정보 관리
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
                  삭제하기
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-4 place-content-center">
            <Link href="/borrow-my-page/account-register" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              +계좌 등록
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}