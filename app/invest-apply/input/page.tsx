"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'

export default function Component() {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("높음")
  const [selectedPercentage, setSelectedPercentage] = useState("10%")
  const [selectedAccount, setSelectedAccount] = useState<{
    bank: string;
    accountNumber: string;
  } | null>(null)
  const [isRiskDropdownOpen, setIsRiskDropdownOpen] = useState(false)
  const [isPercentDropdownOpen, setIsPercentDropdownOpen] = useState(false)

  const riskLevels = ["높음", "중간", "낮음"]
  const percentages = ["5%", "10%", "15%", "20%"]

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

          {/* Percentage Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">이익률 범위 선택</label>
            <div className="relative">
              <Button
                onClick={() => setIsPercentDropdownOpen(!isPercentDropdownOpen)}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 flex items-center justify-center"
              >
                <span>{selectedPercentage}</span>
                <ChevronDown className="h-5 w-5" />
              </Button>
              {isPercentDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg">
                  {percentages.map((percent) => (
                    <button
                      key={percent}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSelectedPercentage(percent)
                        setIsPercentDropdownOpen(false)
                      }}
                    >
                      {percent}
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
                    {selectedAccount.bank} | {selectedAccount.accountNumber}
                  </span>
                ) : (
                  <span className="text-gray-600">투자금 출금 계좌</span>
                )}
              </div>
              <Button 
                onClick={() => {
                  if (!selectedAccount) {
                    setSelectedAccount({
                      bank: "○○은행",
                      accountNumber: "0000-00-0000-000"
                    })
                  }
                }}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-full h-12"
              >
                출금 계좌 선택
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-14 text-lg mt-8"
          >
            투자 상품 조회하기
          </Button>
        </div>
      </main>
    </div>
  )
}