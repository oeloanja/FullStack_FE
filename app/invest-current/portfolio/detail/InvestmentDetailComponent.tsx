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
  settlementId: number
  investmentId: number
  settlementDate: string
  settlementPrincipal: number
  settlementProfit: number
}

interface AccountInfo {
  bankName: string
  accountNumber: string
}

export default function InvestmentDetailComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const investmentId = searchParams.get('id')
  const { user, token } = useAuth()
  const [investment, setInvestment] = useState<InvestmentDetail | null>(null)
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSettlements = async (investmentId: string) => {
    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await api.get(`/api/v1/invest-service/settlements/${investmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data) {
        setSettlements(response.data)
      }
    } catch (error) {
      console.error('정산 내역 조회 중 오류 발생:', error)
      toast.error('정산 내역을 불러오는데 실패했습니다.')
    }
  }

  const fetchInvestmentDetail = async () => {
    try {
      if (!token) {
        toast.error('로그인이 필요합니다.')
        router.push('/auth/login')
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
      await fetchAccountInfo(response.data.accountInvestorId)
      await fetchSettlements(investmentId)
    } catch (error) {
      console.error('투자 상세 정보 조회 중 오류 발생:', error)
      toast.error('투자 상세 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAccountInfo = async (accountInvestorId: number) => {
    try {
      if (!token || !user?.userInvestId) {
        toast.error('인증 정보가 없습니다. 다시 로그인해주세요.')
        return
      }

      const response = await api.get(`/api/v1/user-service/accounts/invest`, {
        params: { userId: user.userInvestId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data && Array.isArray(response.data)) {
        const matchingAccount = response.data.find(account => account.id === accountInvestorId)
        if (matchingAccount) {
          setAccountInfo({
            bankName: matchingAccount.bankName,
            accountNumber: matchingAccount.accountNumber
          })
        } else {
          console.error('일치하는 계좌를 찾을 수 없습니다.')
          toast.error('계좌 정보를 찾을 수 없습니다.')
        }
      } else {
        throw new Error('Invalid response data')
      }
    } catch (error) {
      console.error('계좌 정보 조회 중 오류 발생:', error)
      toast.error('계좌 정보를 불러오는데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchInvestmentDetail()
  }, [investmentId, router, token])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusText = (statusType: number) => {
    switch (statusType) {
      case 0: return '투자 대기'
      case 1: return '투자 중'
      case 2: return '상환 완료'
      case 3: return '투자 취소'
      default: return '알 수 없음'
    }
  }

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
      <div className="border shadow-sm bg-white rounded-2xl p-6 mr-2">
        <div className="grid grid-cols-2">
          {/* Left Column - Basic Info */}
          <div className="space-y-4 border shadow-sm bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">기본 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자금</span>
                <span>{investment.investmentAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자상태</span>
                <span className="px-3 py-1 bg-[#23E2C2] text-white rounded-full text-xs">
                  {getStatusText(investment.investStatusType)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자그룹</span>
                <span>투자그룹 {investment.groupId}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자 완료일</span>
                <span>{formatDate(investment.investmentDate)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자 기대이율</span>
                <span>{investment.expectedReturnRate.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">투자 실제이율</span>
                <span>{investment.actualReturnRate ? `${investment.actualReturnRate.toFixed(2)}%` : '아직 없음'}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Settlement Info */}
          <div className="ml-2 pl-8 border shadow-sm bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-6">정산 정보</h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-20">입금계좌</span>
                <span>
                  {accountInfo 
                    ? `${accountInfo.bankName} | ${accountInfo.accountNumber}` 
                    : '계좌 정보 로딩 중...'}
                </span>
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
            {settlements.length > 0 ? (
              settlements.map((settlement) => (
                <tr key={settlement.settlementId} className="border-t">
                  <td className="py-4">{formatDate(settlement.settlementDate)}</td>
                  <td className="text-right">{settlement.settlementPrincipal.toLocaleString()}원</td>
                  <td className="text-right">{settlement.settlementProfit.toLocaleString()}원</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  정산 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

