"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'
import { useUser } from "@/contexts/UserContext"
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog"
import { getToken } from '@/utils/auth'
import { useRouter } from 'next/navigation'

interface Account {
  accountId: number
  bankName: string
  accountNumber: string
}

export default function InvestApplicationForm() {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("높음")
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isRiskDropdownOpen, setIsRiskDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  const { userInvestId } = useUser()
  const router = useRouter()

  const riskLevels = ["높음", "중간", "낮음"]

  const fetchAccounts = async () => {
    const token = getToken()
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      const response = await api.get(`/api/v1/user-service/accounts/invest`, {
        params: { userId: userInvestId },
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
      localStorage.setItem('selectedAccountId', account.accountId.toString());
      setIsModalOpen(false);
    } else {
      console.error('Invalid account data:', account);
      toast.error('계좌 정보가 올바르지 않습니다. 다시 시도해 주세요.');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error]);

  const handleSubmit = () => {
    if (!selectedAccount) {
      toast.error('계좌를 선택해주세요.');
      return;
    }

    if (!userInvestId) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    // 투자 신청 데이터를 로컬 스토리지에 저장
    const investApplicationData = {
      userInvestId: userInvestId,
      accountInvestId: selectedAccount.accountId,
      riskLevel: selectedRiskLevel
    };
    localStorage.setItem('investApplicationData', JSON.stringify(investApplicationData));

    // 투자 상품 조회 페이지로 이동
    router.push('/invest-apply/select');
  };

  const getRiskLevelOrdinal = (level: string) => {
    switch (level) {
      case "높음": return 2;
      case "중간": return 1;
      case "낮음": return 0;
      default: return 1;
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-md mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">투자 정보 입력</h1>
        
        <div className="space-y-6">
          {/* Risk Level Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">위험도 선택</label>
            <div className="relative">
              <Button
                onClick={() => setIsRiskDropdownOpen(!isRiskDropdownOpen)}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 flex items-center justify-center"
              >
                <span>{selectedRiskLevel}</span>
                <ChevronDown className="h-5 w-5" />
              </Button>
              {isRiskDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg">
                  {riskLevels.map((level) => (
                    <button
                      key={level}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSelectedRiskLevel(level)
                        setIsRiskDropdownOpen(false)
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">계좌 정보</label>
            <div className="border border-dashed border-[#23E2C2] rounded-2xl p-8">
              <div className="text-center mb-4">
                {selectedAccount ? (
                  <span className="text-gray-600">
                    {selectedAccount.bankName} | {selectedAccount.accountNumber}
                  </span>
                ) : (
                  <span className="text-gray-600">투자금 출금 계좌</span>
                )}
              </div>
              <Button 
                onClick={fetchAccounts}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-full h-12"
              >
                {selectedAccount ? "출금 계좌 변경" : "출금 계좌 선택"}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-14 text-lg mt-8"
          >
            투자 상품 조회하기
          </Button>
        </div>
      </main>

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

