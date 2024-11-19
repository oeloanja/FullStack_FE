"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function AccountRegistration() {
  const router = useRouter()
  const [selectedBank, setSelectedBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountHolder, setAccountHolder] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const banks = ["신한은행", "국민은행", "우리은행", "하나은행"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userId = 1;
      await axios.post(`http://localhost:8085/api/accounts/invest?userId=${userId}`, {
        bankName: selectedBank,
        accountNumber,
        accountHolder
      });
      router.push('/invest-my-page')
    } catch (error) {
      console.error("Error registering account:", error);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">투자자 계좌 등록</h1>

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
          <label htmlFor="account-holder" className="block text-sm font-medium text-gray-700">
            예금주
          </label>
          <input
            id="account-holder"
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="예금주 이름을 입력해 주세요."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12"
        >
          계좌 등록 완료
        </Button>
      </form>
    </div>
  )
}