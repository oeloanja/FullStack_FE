"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ArrowUpDown } from 'lucide-react'

export default function Component() {
  const [investments, setInvestments] = useState([
    { id: 1, amount: "", rate: 14 },
    { id: 2, amount: "", rate: 12 },
    { id: 3, amount: "", rate: 16 },
    { id: 4, amount: "", rate: 13 },
    { id: 5, amount: "", rate: 15 },
  ])
  const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high')

  const handleAmountChange = (id: number, value: string) => {
    setInvestments(investments.map(inv => 
      inv.id === id ? { ...inv, amount: value } : inv
    ))
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'high' ? 'low' : 'high')
  }

  const sortedInvestments = [...investments].sort((a, b) => 
    sortOrder === 'high' ? b.rate - a.rate : a.rate - b.rate
  )

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
              <div key={investment.id} className="flex gap-4">
                <Button
                  className="flex-1 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 text-sm"
                >
                  대출그룹 A | 위험도: 중 | 예상수익률: {investment.rate}%
                </Button>
                <div className="w-48">
                  <input
                    type="text"
                    placeholder="투자금 입력"
                    value={investment.amount}
                    onChange={(e) => handleAmountChange(investment.id, e.target.value)}
                    className="w-full h-12 bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#23E2C2] focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-14 text-lg mt-8"
          >
            투자 신청 완료하기
          </Button>
        </div>
      </main>
    </div>
  )
}