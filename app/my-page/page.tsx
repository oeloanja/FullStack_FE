"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Check } from 'lucide-react'
import Link from "next/link"

type BankAccount = {
  id: number
  bank: string
  accountNumber: string
  accountHolder: string
}

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'account'>('personal')
  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: 1, bank: "○○은행", accountNumber: "0000-00-0000-000", accountHolder: "응우엔" },
    { id: 2, bank: "○○은행", accountNumber: "0000-00-0000-000", accountHolder: "응우엔" },
    { id: 3, bank: "○○은행", accountNumber: "0000-00-0000-000", accountHolder: "응우엔" },
  ])

  const userInfo = {
    email: "example@example.com",
    name: "응우엔",
    phone: "010-8884-8884"
  }

  const handleDeleteAccount = (id: number) => {
    setAccounts(accounts.filter(account => account.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">마이페이지</h1>

      {/* Tabs */}
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

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-24 text-gray-600">이메일</span>
              <span>{userInfo.email}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">이름</span>
              <span>{userInfo.name}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-gray-600">전화번호</span>
              <span>{userInfo.phone}</span>
            </div>
          </div>

          <div className="flex gap-4 ">
          <Link href="/my-page/change-password" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              비밀번호 변경
            </Link>
            <Link href="/my-page/change-number" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              전화번호 수정
            </Link>
          </div>
        </div>
      )}

      {/* Account Management Tab */}
      {activeTab === 'account' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div 
                key={account.id} 
                className="border shadow-sm bg-white rounded-2xl p-6 space-y-5"
              >
                <div className="text-lg font-medium">{account.bank}</div>
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
          <Link href="/my-page/account-register" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              +계좌 등록
            </Link>
            </div>
        </div>
      )}
    </div>
  )
}