"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Check } from 'lucide-react'
import Link from "next/link"
import axios from 'axios'

type BankAccount = {
  id: number
  bankName: string
  accountNumber: string
  accountHolder: string
}

export default function InvestorMyPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'account'>('personal')
  const [accounts, setAccounts] = useState<BankAccount[]>([])

  const userInfo = {
    email: "investor@example.com",
    name: "투자자",
    phone: "010-9876-5432"
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const userId = 1;
      const response = await axios.get(`http://localhost:8085/api/accounts/invest?userId=${userId}`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      const userId = 1;
      await axios.put(`http://localhost:8085/api/accounts/invest/${id}/status?userId=${userId}`, { isDeleted: true });
      setAccounts(accounts.filter(account => account.id !== id))
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">투자자 마이페이지</h1>

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

          <div className="flex gap-4">
            <Link href="/invest-my-page/change-password" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              비밀번호 변경
            </Link>
            <Link href="/invest-my-page/change-number" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
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
            <Link href="/invest-my-page/account-register" className="w-96 h-10 text-center pt-2 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg">
              +계좌 등록
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}