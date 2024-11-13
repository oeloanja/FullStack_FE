"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/button"

export default function Component() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('전체보기')
  const loanHistory = [
    {
      period: "2024.09.15 - 2025.08.15",
      amount: "7,000,000원",
      rate: "18%",
      status: "대출 중",
      isActive: true
    },
    {
      period: "2021.10.25 - 2022.09.25",
      amount: "10,000,000원",
      rate: "14%",
      status: "대출 취소",
      isActive: false
    },
    {
      period: "2021.10.25 - 2022.09.25",
      amount: "10,000,000원",
      rate: "14%",
      status: "상환 완료",
      isActive: false
    },
    {
      period: "2021.10.25 - 2022.09.25",
      amount: "10,000,000원",
      rate: "14%",
      status: "상환 완료",
      isActive: false
    },
    {
      period: "2021.10.25 - 2022.09.25",
      amount: "10,000,000원",
      rate: "14%",
      status: "상환 완료",
      isActive: false
    },
    {
      period: "2021.10.25 - 2022.09.25",
      amount: "10,000,000원",
      rate: "14%",
      status: "상환 완료",
      isActive: false
    }
  ]

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Credit Grade Card */}
      <div className="border shadow-sm bg-white rounded-2xl p-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold mb-1">나의 신용등급</h2>
          <p className="text-sm text-gray-500">최근 업데이트 : 2024.11.13</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-[#23E2C2] flex items-center justify-center">
          <span className="text-3xl font-bold text-[#23E2C2]">B</span>
        </div>
      </div>

      {/* Loan History Card */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">대출 이력</h2>
          <div className="relative">
            <Button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between bg-white  text-[#23E2C2] border border-[#23E2C2] hover:bg-[#23E2C2] hover:text-white transition-colors px-4 py-2 rounded-2xl"
            >
              <span className="text-sm mr-2">{selectedFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {['전체보기', '대출 중', '대출 취소', '상환 완료', '대출 희망'].map((option) => (
                  <Button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none"
                    onClick={() => {
                      setSelectedFilter(option)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#23E2C2] text-white rounded-lg">
                <th className="py-3 px-4 text-left font-medium">대출 기간</th>
                <th className="py-3 px-4 text-left font-medium">대출금</th>
                <th className="py-3 px-4 text-left font-medium">금리</th>
                <th className="py-3 px-4 text-right font-medium">대출상태</th>
              </tr>
            </thead>
            <tbody>
              {loanHistory.map((loan, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4">{loan.period}</td>
                  <td className="py-4 px-4">{loan.amount}</td>
                  <td className="py-4 px-4">{loan.rate}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={`${
                      loan.isActive ? 'text-[#23E2C2]' : 'text-gray-400'
                    }`}>
                      {loan.status}
                    </span>
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