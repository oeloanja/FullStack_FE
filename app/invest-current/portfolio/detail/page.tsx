"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/utils/api'
import { useAuth } from "@/contexts/AuthContext"
import { toast } from 'react-hot-toast'

interface InvestmentDetail {
  investmentId: number
  groupId: number
  userInvestorId: number
  accountInvestorId: number
  investmentAmount: number
  investmentDate: string
  expectedReturnRate: number
  createdAt: string
  investStatusType: number
  settlementRatio: number
  actualReturnRate: number | null
}

interface Settlement {
  date: string
  amount: number
  interest: number
}

export default function InvestmentDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const investmentId = searchParams.get('id')
  const { token } = useAuth()
  const [investment, setInvestment] = useState<InvestmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<{ bankName: string, accountNumber: string } | null>(null);

  // Mock settlements data - replace with actual API data
  const settlements: Settlement[] = [
    { date: '2024.10.25', amount: 777777, interest: 77777 },
    { date: '2024.11.25', amount: 777777, interest: 77777 },
  ]

  useEffect(() => {
    const fetchInvestmentDetail = async () => {
      try {
        if (!token) {
          toast.error('로그인이 필요합니다.')
          router.push('/login')
          return
        }

        if (!investmentId) {
          toast.error('투자 ID가 필요합니다.')
          router.push('/invest-current/portfolio')
          return
        }

        const response = await api.get(`/api/v1/invest-service/investments/detail?investmentId=${investmentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        setInvestment(response.data)
      } catch (error) {
        console.error('투자 상세 정보 조회 중 오류 발생:', error)
        toast.error('투자 상세 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestmentDetail()
  }, [investmentId, router, token])

  useEffect(() => {
    const storedInvestData = localStorage.getItem('investApplicationData');
    if (storedInvestData) {
      const { accountInvestId } = JSON.parse(storedInvestData);
      const storedAccountData = localStorage.getItem('selectedAccountId');
      if (storedAccountData && storedAccountData === accountInvestId.toString()) {
        const accountInfo = JSON.parse(localStorage.getItem('selectedAccount') || '{}');
        setSelectedAccount(accountInfo);
      }
    }
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!investment) {
    return <div className="text-center mt-8">투자 정보를 찾을 수 없습니다.</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">투자 현황</h1>
      
      {/* Investment Status Card */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <div className="grid grid-cols-2">
          {/* Left Column - Basic Info */}
          <div className="mr-2 space-y-4 border shadow-sm bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">기본 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자금</span>
                <span>{investment.investmentAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자상태</span>
                <span className="px-3 py-1 bg-[#23E2C2] text-white rounded-full text-xs">
                  투자 중
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자그룹</span>
                <span>투자그룹 A</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자그룹 신용도</span>
                <span>B</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자 완료일</span>
                <span>2024.12.25</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자기간</span>
                <span>12개월</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자 기대이율</span>
                <span>18%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자 실제이율</span>
                <span>16%</span>
              </div>
            </div>
          </div>

          {/* Right Column - Settlement Info */}
          <div className="ml-2 pl-8 border shadow-sm bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">정산 정보</h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">입금계좌</span>
                <span>{selectedAccount ? `${selectedAccount.bankName} | ${selectedAccount.accountNumber}` : '계좌 정보 없음'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement History Card */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6">정산 현황</h2>
        <table className="w-full">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="text-left py-2">정산일</th>
              <th className="text-right py-2">원금</th>
              <th className="text-right py-2">수익금</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((settlement, index) => (
              <tr key={index} className="border-t">
                <td className="py-4">{settlement.date}</td>
                <td className="text-right">{settlement.amount.toLocaleString()}원</td>
                <td className="text-right">{settlement.interest.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

