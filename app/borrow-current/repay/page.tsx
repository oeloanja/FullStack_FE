"use client"

import { useState } from "react"
import { Button } from "@/components/button"

export default function Component() {
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<{
    bank: string;
    accountNumber: string;
  } | null>(null)

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">상환하기</h1>
        
        <form className="space-y-6">
          {/* Repayment Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-600">
              상환금
            </label>
            <input
              id="amount"
              type="text"
              placeholder="상환금 입력"
              value={repaymentAmount}
              onChange={(e) => setRepaymentAmount(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            />
          </div>

          {/* Account Information */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              계좌 정보
            </label>
            <div className="border border-dashed border-[#23E2C2] rounded-2xl p-8">
              <div className="text-center mb-4">
                {selectedAccount ? (
                  <span className="text-gray-600">
                    {selectedAccount.bank} | {selectedAccount.accountNumber}
                  </span>
                ) : (
                  <span className="text-gray-600">대출금 상환 계좌</span>
                )}
              </div>
              <Button 
                onClick={() => {
                  if (!selectedAccount) {
                    setSelectedAccount({
                      bank: "○○은행",
                      accountNumber: "0000-00-0000-000"
                    })
                  }
                }}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
              >
                출금 계좌 선택
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit"
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-md h-14 text-lg mt-8"
          >
            상환하기
          </Button>
        </form>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        © BillIT Inc. 2024
      </footer>
    </div>
  )
}