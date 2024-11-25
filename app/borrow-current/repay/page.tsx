"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog"
import { useUser } from "@/contexts/UserContext"
import api from '@/utils/api'
import { getToken } from '@/utils/auth'
import { toast } from 'react-hot-toast'

interface Account {
  accountId: number
  bankName: string
  accountNumber: string
}

export default function RepaymentPage() {
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  const { userBorrowId } = useUser()

  const fetchAccounts = async () => {
    const token = getToken()
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      const response = await api.get(`/api/v1/user-service/accounts/borrow`, {
        params: { userId: userBorrowId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data && Array.isArray(response.data)) {
        const validAccounts = response.data.map(account => ({
          accountId: account.id,
          bankName: account.bankName,
          accountNumber: account.accountNumber
        }));
        setAccounts(validAccounts);
        if (validAccounts.length > 0) {
          setIsModalOpen(true);
        } else {
          toast.error('유효한 계좌가 없습니다. 계좌 등록을 진행해 주세요!');
        }
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('계좌 목록 조회 중 오류 발생:', error)
      toast.error('계좌 목록을 불러오는데 실패했습니다.')
      setError('계좌 목록을 불러오는데 실패했습니다.')
    }
  }

  const handleAccountSelect = (account: Account) => {
    if (account && typeof account.accountId !== 'undefined') {
      setSelectedAccount(account);
      setIsModalOpen(false);
    } else {
      console.error('Invalid account data:', account);
      toast.error('계좌 정보가 올바르지 않습니다. 다시 시도해 주세요.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement repayment logic here
    console.log("Repayment submitted", { repaymentAmount, selectedAccount })
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">상환하기</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    {selectedAccount.bankName} | {selectedAccount.accountNumber}
                  </span>
                ) : (
                  <span className="text-gray-600">대출금 상환 계좌</span>
                )}
              </div>
              <Button 
                onClick={fetchAccounts}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
              >
                {selectedAccount ? "출금 계좌 변경" : "출금 계좌 선택"}
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

      {/* Account Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>계좌 선택</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {accounts.map((account) => (
              <Button
                key={account.accountId}
                onClick={() => account.accountId !== undefined ? handleAccountSelect(account) : null}
                className="w-full mb-2 text-left justify-start"
              >
                {account.bankName} | {account.accountNumber}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

