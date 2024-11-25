"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/button"
import { CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/utils/api'
import { getToken } from '@/utils/auth'

interface InvestmentData {
  investments: Array<{
    groupId: number
    userInvestorId: number
    accountInvestorId: number
    investmentAmount: number
    expectedReturnRate: number
  }>
  totalAmount: number
}

export default function InvestmentSuccessContent() {
  const router = useRouter()
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedData = localStorage.getItem('selectedInvestments')
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setInvestmentData(parsedData)
      } catch (error) {
        console.error('Failed to parse investment data:', error)
        toast.error('투자 정보를 불러오는데 실패했습니다.')
        router.push('/invest-apply/select')
      }
    } else {
      toast.error('투자 정보를 찾을 수 없습니다.')
      router.push('/invest-apply/select')
    }
  }, [router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  const handleConfirmInvestment = async () => {
    setIsLoading(true)

    try {
      const token = getToken()
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await api.post('/api/v1/invest-service/investments/create', 
        investmentData?.investments,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        toast.success('투자가 성공적으로 완료되었습니다.')
        localStorage.removeItem('selectedInvestments')
        localStorage.removeItem('investApplicationData')
        router.push('/')
      } else {
        throw new Error('투자 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('투자 생성 중 오류 발생:', error)
      toast.error('투자 생성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border shadow-sm bg-white rounded-2xl p-6 max-w-md w-full text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">투자 신청 완료!</h1>
      <p className="text-gray-600 mb-6">
        투자 신청이 완료되었습니다.<br/> 확정 버튼을 눌러 투자를 진행하세요.
      </p>
      {investmentData && (
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">투자 내역</h2>
          <p className="text-gray-600">총 투자 금액: {formatCurrency(investmentData.totalAmount)}</p>
          <ul className="mt-2">
            {investmentData.investments.map((inv, index) => (
              <li key={index} className="text-sm text-gray-600">
                그룹 {inv.groupId}: {formatCurrency(inv.investmentAmount)} (예상 수익률: <a className='text-[#23E2C2] font-bold'>{inv.expectedReturnRate.toFixed(2)}%</a>)
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-4">
        <Button
          onClick={handleConfirmInvestment}
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '투자 확정하기'}
        </Button>
      </div>
    </div>
  )
}

