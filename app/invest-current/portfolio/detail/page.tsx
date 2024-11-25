"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/button"
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { getToken } from '@/utils/auth'
import { toast } from 'react-hot-toast'
import type { InvestmentDetail } from '@/types/portpolio'

export default function InvestmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [investment, setInvestment] = useState<InvestmentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvestmentDetail = async () => {
      try {
        const token = getToken()
        if (!token) {
          toast.error('로그인이 필요합니다.')
          return
        }

        const response = await api.get(`/api/v1/invest-service/investments/${params.id}`, {
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

    if (params.id) {
      fetchInvestmentDetail()
    }
  }, [params.id])

  const handleInvestmentCancel = async () => {
    try {
      const token = getToken()
      if (!token) {
        toast.error('로그인이 필요합니다.')
        return
      }

      await api.put(`/api/v1/invest-service/investments/${params.id}/cancel`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      toast.success('투자가 취소되었습니다.')
      router.push('/invest-current/portfolio')
    } catch (error) {
      console.error('투자 취소 중 오류 발생:', error)
      toast.error('투자 취소에 실패했습니다.')
    }
  }

  if (isLoading || !investment) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">투자 현황</h1>
        {investment.status === '투자 대기' && (
          <Button 
            onClick={handleInvestmentCancel}
            className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
          >
            투자 취소
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6
shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="border shadow-sm bg-white rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">투자금</span>
                <span>{investment.amount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">투자상태</span>
                <span>{investment.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">투자 이름</span>
                <span>{investment.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">투자 평균 신용도</span>
                <span>{investment.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">투자기간</span>
                <span>{investment.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">투자 기대이익률</span>
                <span>{investment.expectedRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">투자 실제이익률</span>
                <span>{investment.actualRate}%</span>
              </div>
            </div>
          </div>
          <div className="border shadow-sm bg-white rounded-2xl p-6 content-center">
            <h2 className="text-lg font-semibold mb-4">정산 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">다음 상환일</span>
                <span>{investment.nextPaymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">전체 만기일</span>
                <span>{investment.maturityDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">입금계좌</span>
                <span>{investment.accountInfo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">정산 현황</h2>
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#23E2C2] h-2.5 rounded-full" 
              style={{ width: `${investment.completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">
            {investment.completionPercentage}% (12회차 중 {Math.floor(investment.completionPercentage / (100/12))}회차 정산 완료)
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">회차</th>
              <th className="text-left py-2">정산일</th>
              <th className="text-right py-2">원금</th>
              <th className="text-right py-2">수익금</th>
              <th className="text-right py-2">상환상태</th>
            </tr>
          </thead>
          <tbody>
            {investment.payments.map((payment) => (
              <tr key={payment.number} className="border-b last:border-b-0">
                <td className="py-2">{payment.number}회차</td>
                <td className="py-2">{payment.date}</td>
                <td className="text-right py-2">{payment.amount.toLocaleString()}원</td>
                <td className="text-right py-2">{payment.returns.toLocaleString()}원</td>
                <td className="text-right py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === '정산완료' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

