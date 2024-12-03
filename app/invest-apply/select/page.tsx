"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { ArrowUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuth } from "@/contexts/AuthContext"
import { toast } from 'react-hot-toast'
import { formatNumber, parseNumber } from '@/utils/numberFormat'

interface LoanGroup {
  groupId: number
  groupName: string
  intRate: number
  riskLevel: string
  isFulled: boolean
  amount?: string
}

export default function InvestmentSelection() {
  const [investments, setInvestments] = useState<LoanGroup[]>([])
  const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { token } = useAuth()

  useEffect(() => {
    const fetchInvestments = async () => {
      setIsLoading(true)
      try {
        const investData = localStorage.getItem('investApplicationData')
        if (!investData) {
          toast.error('투자 정보를 찾을 수 없습니다.')
          router.push('/invest-apply/input')
          return
        }

        const { riskLevel } = JSON.parse(investData)
        const riskLevelOrdinal = getRiskLevelOrdinal(riskLevel)

        if (!token) {
          toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.')
          router.push('/login')
          return
        }

        const response = await api.get(`/api/v1/loan-group-service/list/${riskLevelOrdinal}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data && Array.isArray(response.data)) {
          setInvestments(response.data)
        } else {
          throw new Error('Invalid response data')
        }
      } catch (error) {
        console.error('투자 상품 조회 중 오류 발생:', error)
        toast.error('투자 상품을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestments()
  }, [router, token])

  const handleAmountChange = (id: number, value: string) => {
    const formattedValue = formatNumber(value)
    setInvestments(investments.map(inv => 
      inv.groupId === id ? { ...inv, amount: formattedValue } : inv
    ))
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'high' ? 'low' : 'high')
  }

  const sortedInvestments = [...investments].sort((a, b) => 
    sortOrder === 'high' ? b.intRate - a.intRate : a.intRate - b.intRate
  )

  const getRiskLevelOrdinal = (level: string) => {
    switch (level) {
      case "높음": return 2;
      case "중간": return 1;
      case "낮음": return 0;
      default: return 1;
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case "HIGH": return "높음";
      case "MEDIUM": return "중간";
      case "LOW": return "낮음";
      default: return "중간";
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (!token) {
        toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.')
        router.push('/login')
        return
      }

      const investData = localStorage.getItem('investApplicationData')
      if (!investData) {
        toast.error('투자 정보를 찾을 수 없습니다.')
        return
      }

      const { userInvestId, accountInvestId } = JSON.parse(investData)

      const selectedInvestments = investments
        .filter(inv => inv.amount && parseNumber(inv.amount) > 0)
        .map(inv => ({
          groupId: inv.groupId,
          userInvestorId: userInvestId,
          accountInvestorId: accountInvestId,
          investmentAmount: parseNumber(inv.amount!),
          expectedReturnRate: inv.intRate
        }))

      if (selectedInvestments.length === 0) {
        toast.error('최소 하나 이상의 투자 상품을 선택해주세요.')
        return
      }

      localStorage.setItem('selectedInvestments', JSON.stringify({
        investments: selectedInvestments,
        totalAmount: selectedInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0)
      }))

      router.push('/invest-apply/success')
    } catch (error) {
      console.error('투자 선택 중 오류 발생:', error)
      toast.error('투자 선택에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">투자 상품 선택</h1>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm text-gray-600">모집 중인 투자 상품 선택</h2>
            <Button
              variant="outline"
              size="sm"
              className="text-[#23E2C2] border-[#23E2C2] hover:bg-[#23E2C2] hover:text-white"
              onClick={toggleSortOrder}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              수익률 {sortOrder === 'high' ? '높은' : '낮은'} 순
            </Button>
          </div>

          {/* Investment Options */}
          <div className="space-y-4">
            {sortedInvestments.map((investment) => (
              <div key={investment.groupId} className="flex gap-4">
                <Button
                  className="flex-1 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 text-sm"
                >
                  {(investment.groupName).match(/^.{5}/)?.[0] || ''} | 위험도: {getRiskLevelText(investment.riskLevel)} | 예상수익률: {investment.intRate.toFixed(2)}%
                </Button>
                <div className="w-48">
                  <input
                    type="text"
                    placeholder="투자금 입력"
                    value={investment.amount || ""}
                    onChange={(e) => handleAmountChange(investment.groupId, e.target.value)}
                    className="w-full h-12 bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#23E2C2] focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-14 text-lg mt-8 disabled:opacity-50"
          >
            {isSubmitting ? '처리 중...' : '투자 신청 완료하기'}
          </Button>
        </div>
      </main>
    </div>
  )
}

