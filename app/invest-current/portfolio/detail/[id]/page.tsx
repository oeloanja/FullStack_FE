"use client"

import { use } from 'react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/button"

type Investment = {
  id: number
  loanGroup: string
  amount: number
  grade: string
  expectedRate: number
  actualRate: number
  period: string
  status: '투자 중' | '상환 완료' | '투자 대기'
}

type PaymentStatus = {
  number: number
  date: string
  amount: number
  returns: number
  status: '정산완료' | '정산예정'
}

// This function simulates fetching data from an API or database
const fetchInvestmentDetails = (id: number): Investment => {
  const investments: Investment[] = [
    { id: 1, loanGroup: '대출그룹 A', amount: 5000000, grade: 'B', expectedRate: 13, actualRate: 11.5, period: '12개월', status: '투자 중' },
    { id: 2, loanGroup: '대출그룹 B', amount: 3000000, grade: 'C', expectedRate: 28, actualRate: 6.5, period: '12개월', status: '상환 완료' },
    { id: 3, loanGroup: '대출그룹 C', amount: 2000000, grade: 'C', expectedRate: 8, actualRate: 26.5, period: '12개월', status: '투자 대기' },
    { id: 4, loanGroup: '대출그룹 D', amount: 1000000, grade: 'A', expectedRate: 1, actualRate: 17.5, period: '12개월', status: '투자 중' },
    { id: 5, loanGroup: '대출그룹 E', amount: 10000000, grade: 'B', expectedRate: 118, actualRate: 126.5, period: '12개월', status: '투자 중' },
    { id: 6, loanGroup: '대출그룹 F', amount: 7000000, grade: 'D', expectedRate: 18, actualRate: 16.5, period: '12개월', status: '투자 중' },
  ]
  return investments.find(inv => inv.id === id) || investments[0]
}

export default function InvestmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [investment, setInvestment] = useState<Investment | null>(null)

  useEffect(() => {
    if (id) {
      const investmentData = fetchInvestmentDetails(Number(id))
      setInvestment(investmentData)
    }
  }, [id])

  const paymentStatuses: PaymentStatus[] = [
    { number: 1, date: '2024.10.25', amount: 777777, returns: 77777, status: '정산완료' },
    { number: 2, date: '2024.11.25', amount: 777777, returns: 77777, status: '정산예정' },
  ]

  const completionPercentage = 8

  if (!investment) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">투자 현황</h1>
        <Button className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white">투자 취소</Button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
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
                <span>{investment.loanGroup}</span>
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
                <span>2024.11.25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">전체 만기일</span>
                <span>2024.12.25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">입금계좌</span>
                <span>○○은행 | 0000-00-0000-000</span>
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
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">
            {completionPercentage}% (12회차 중 1회차 정산 완료)
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
            {paymentStatuses.map((payment) => (
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