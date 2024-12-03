"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog"
import { useAuth } from "@/contexts/AuthContext"
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import { formatNumber, parseNumber } from '@/utils/numberFormat'

interface Account {
  accountId: number
  bankName: string
  accountNumber: string
}

export default function RepaymentPage() {
  const router = useRouter()
  const [repaymentAmount, setRepaymentAmount] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user, token } = useAuth()
  const [loanId, setLoanId] = useState<number | null>(null)
  const [requiredAmount, setRequiredAmount] = useState<number | null>(null)

  useEffect(() => {
    const fetchCurrentLoan = async () => {
      try {
        if (!user?.userBorrowId) return;
        
        const response = await api.get(`/api/v1/loan-service/history/${user?.userBorrowId}/filter`, {
          params: { loanStatus: 1 },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.length > 0) {
          setLoanId(response.data[0].loanId);
        } else {
          toast.error('현재 진행중인 대출이 없습니다.');
          router.push('/borrow-current');
        }
      } catch (error) {
        console.error('대출 정보 조회 중 오류 발생:', error);
        toast.error('대출 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchCurrentLoan();
  }, [user?.userBorrowId, router]);

  useEffect(() => {
    const fetchRepaymentAmount = async () => {
      if (!loanId) return;
    
      try {
        if (!token) return;

        const response = await api.get(`/api/v1/repayment-service`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data) {
          const repayment = response.data.find(r => r.loanId === loanId);
          if (repayment) {
            const total = parseFloat(repayment.repaymentPrincipal) + parseFloat(repayment.repaymentInterest);
            setRequiredAmount(total);
          }
        }
      } catch (error) {
        console.error('상환 정보 조회 중 오류 발생:', error);
        toast.error('상환 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchRepaymentAmount();
  }, [loanId, token]);

  const fetchAccounts = async () => {
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      const response = await api.get(`/api/v1/user-service/accounts/borrow`, {
        params: { userId: user?.userBorrowId },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loanId) {
      toast.error('대출 정보를 찾을 수 없습니다.');
      return;
    }

    if (!selectedAccount) {
      toast.error('계좌를 선택해주세요.');
      return;
    }

    if (!repaymentAmount) {
      toast.error('올바른 상환 금액을 입력해주세요.');
      return;
    }

    const amount = parseNumber(repaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('올바른 상환 금액을 입력해주세요.');
      return;
    }

    // Add validation for repayment amount
    if (requiredAmount !== null && amount > requiredAmount) {
      alert("이번 회차에 갚아야 할 금액 이상으로 입력하셨습니다! 다시 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await api.post(
        '/api/v1/repayment-service/create/repayment-process',
        {
          loanId: loanId,
          actualRepaymentAmount: amount
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success('상환이 성공적으로 처리되었습니다.');
        router.push('/borrow-current');
      } else {
        throw new Error('상환 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('상환 처리 중 오류 발생:', error);
      toast.error('상환 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
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
            {requiredAmount !== null && (
              <div className="mb-2 text-gray-600">
                이번 회차에 갚아야 할 금액: {formatNumber(requiredAmount)}원
              </div>
            )}
            <input
              id="amount"
              type="text"
              placeholder="상환금 입력"
              value={repaymentAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setRepaymentAmount('');
                  return;
                }
                const formatted = formatNumber(value);
                setRepaymentAmount(formatted);
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-lg"
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
                type="button"
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
            disabled={isLoading}
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-md h-14 text-lg mt-8 disabled:opacity-50"
          >
            {isLoading ? '처리 중...' : '상환하기'}
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

