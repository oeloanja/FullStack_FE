"use client"

import { useState } from 'react'
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

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

export default function PortfolioPage() {
  const [investments] = useState<Investment[]>([
    { id: 1, loanGroup: '대출그룹 A', amount: 5000000, grade: 'B', expectedRate: 13, actualRate: 11.5, period: '12개월', status: '투자 중' },
    { id: 2, loanGroup: '대출그룹 B', amount: 3000000, grade: 'C', expectedRate: 28, actualRate: 6.5, period: '12개월', status: '상환 완료' },
    { id: 3, loanGroup: '대출그룹 C', amount: 2000000, grade: 'C', expectedRate: 8, actualRate: 26.5, period: '12개월', status: '투자 대기' },
    { id: 4, loanGroup: '대출그룹 D', amount: 1000000, grade: 'A', expectedRate: 1, actualRate: 17.5, period: '12개월', status: '투자 중' },
    { id: 5, loanGroup: '대출그룹 E', amount: 10000000, grade: 'B', expectedRate: 118, actualRate: 126.5, period: '12개월', status: '투자 중' },
    { id: 6, loanGroup: '대출그룹 F', amount: 7000000, grade: 'D', expectedRate: 18, actualRate: 16.5, period: '12개월', status: '투자 중' },
  ])

  const [selectedFilter, setSelectedFilter] = useState<'전체보기' | '투자 중' | '상환 완료' | '투자 대기'>('전체보기')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const activeInvestments = investments.filter(inv => inv.status === '투자 중').length
  const averageRate = investments.reduce((sum, inv) => sum + inv.actualRate, 0) / investments.length
  const totalReturns = investments.reduce((sum, inv) => sum + (inv.amount * inv.actualRate / 100), 0)

  const filteredInvestments = selectedFilter === '전체보기' 
    ? investments 
    : investments.filter(inv => inv.status === selectedFilter)

  return (
    <div className="flex flex-col space-y-6 p-6 min-h-screen">
      {/* Summary Card */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">투자 포트폴리오</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">총 투자금액</p>
            <p className="text-xl font-bold">{totalInvestment.toLocaleString()}원</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">진행중인 투자</p>
            <p className="text-xl font-bold">{activeInvestments}건</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">평균 수익률</p>
            <p className="text-xl font-bold text-[#23E2C2]">{averageRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">총 수익금</p>
            <p className="text-xl font-bold text-[#23E2C2]">{totalReturns.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">투자 이력</h2>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="text-[#23E2C2] border-[#23E2C2] hover:bg-[#23E2C2] hover:text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedFilter}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                {['전체보기', '투자 중', '상환 완료', '투자 대기'].map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter(option as '전체보기' | '투자 중' | '상환 완료' | '투자 대기')
                      setIsDropdownOpen(false)
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#23E2C2] text-white">
              <tr>
                <th className="py-3 px-4 text-center">대출그룹 이름</th>
                <th className="py-3 px-4 text-center">투자금액</th>
                <th className="py-3 px-4 text-center">평균신용도</th>
                <th className="py-3 px-4 text-center">기대 수익률</th>
                <th className="py-3 px-4 text-center">실제 수익률</th>
                <th className="py-3 px-4 text-center">투자기간</th>
                <th className="py-3 px-4 text-center">투자상태</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map((investment) => (
                <tr key={investment.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4 text-center">{investment.loanGroup}</td>
                  <td className="py-4 px-4 text-center">{investment.amount.toLocaleString()}원</td>
                  <td className="py-4 px-4 text-center">{investment.grade}</td>
                  <td className="py-4 px-4 text-center">{investment.expectedRate}%</td>
                  <td className="py-4 px-4 text-center">{investment.actualRate}%</td>
                  <td className="py-4 px-4 text-center">{investment.period}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      investment.status === '투자 중' ? 'bg-green-100 text-green-800' :
                      investment.status === '상환 완료' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {investment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Link href={`/invest-current/portfolio/detail/${investment.id}`}>
                      <Button
                        size="sm"
                        className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
                      >
                        상세보기
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}