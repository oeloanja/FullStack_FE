"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'

export default function Component() {
  const [formData, setFormData] = useState({
    address: "",
    detailAddress: "",
    accountNumber: ""
  })
  const [selectedAccount, setSelectedAccount] = useState<{
    bank: string;
    accountNumber: string;
  } | null>(null)
  const [openDropdown, setOpenDropdown] = useState<'reason' | 'period' | null>(null)
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("6개월")

  const reasons = [
    "채무정리",
    "신용카드",
    "주택개선(리모델링)",
    "대환 구매",
    "의료",
    "사업",
    "차량 구매",
    "휴가",
    "이주",
    "집 구매",
    "결혼",
    "교육",
    "기타"
  ]

  const periods = ["3개월", "6개월", "12개월"]

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">대출 정보 입력</h1>
        
        {/* Progress Bar */}
        <div className="bg-gray-100 rounded-[80px] py-8 px-6 relative mb-12">
          <div className="flex justify-between items-center relative">
            {/* Dotted line */}
            <div className="absolute top-[18px] left-0 right-0 flex justify-between px-8">
              {[...Array(33)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full ${i < 1 ? 'bg-[#23E2C2]' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            {/* Progress circles and labels */}
            <div className="flex justify-between w-full relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">대출 정보 입력</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mb-3" />
                <span className="text-sm font-medium text-gray-400">신용 평가</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mb-3" />
                <span className="text-sm font-medium text-gray-400">대출 조건 확인</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-2">마이데이터 불러오기</h2>
              <Button 
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
              >
                마이데이터 한 번에 불러오기
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-medium text-gray-600">주소 입력</h2>
              <div className="flex gap-2">
                <Button 
                  className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] px-6"
                >
                  주소 검색
                </Button>
                <input
                  type="text"
                  placeholder="주소 검색 버튼을 눌러 주소 입력"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  readOnly
                />
              </div>
              <input
                type="text"
                placeholder="상세 주소 입력"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                value={formData.detailAddress}
                onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
              />
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-2">필수 서류 제출</h2>
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
                >
                  소득증명원 업로드
                </Button>
                <Button 
                  className="flex-1 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
                >
                  재직증명서 업로드
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="relative">
              <h2 className="text-sm font-medium text-gray-600 mb-2">대출 신청 사유</h2>
              <Button 
                onClick={() => setOpenDropdown(openDropdown === 'reason' ? null : 'reason')}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12 flex items-center justify-between px-4"
              >
                <span className="flex-grow text-center">{selectedReason || "신청 사유를 선택해주세요"}</span>
                <ChevronDown className="h-5 w-5 flex-shrink-0" />
              </Button>
              {openDropdown === 'reason' && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-[10px] shadow-lg border border-gray-100">
                  <div className="py-2">
                    {reasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          setSelectedReason(reason)
                          setOpenDropdown(null)
                        }}
                        className="w-full px-4 py-2 text-center hover:bg-gray-50 text-sm"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <h2 className="text-sm font-medium text-gray-600 mb-2">상환 기간</h2>
              <Button 
                onClick={() => setOpenDropdown(openDropdown === 'period' ? null : 'period')}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12 flex items-center justify-between px-4"
              >
                <span className="flex-grow text-center">{selectedPeriod}</span>
                <ChevronDown className="h-5 w-5 flex-shrink-0" />
              </Button>
              {openDropdown === 'period' && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-[10px] shadow-lg border border-gray-100">
                  <div className="py-2">
                    {periods.map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period)
                          setOpenDropdown(null)
                        }}
                        className="w-full px-4 py-2 text-center hover:bg-gray-50 text-sm"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">* 상환기간은 원리금 균등상환으로 고정됩니다</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-600 mb-2">계좌 정보</h2>
              <div className="border border-dashed border-[#23E2C2] rounded-2xl p-8">
                <div className="text-center mb-4">
                  {selectedAccount ? (
                    <span className="text-gray-600">
                      {selectedAccount.bank} | {selectedAccount.accountNumber}
                    </span>
                  ) : (
                    <span className="text-gray-600">대출금 입금 계좌</span>
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
                  className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
                >
                  {selectedAccount ? "입금 계좌 변경" : "입금 계좌 선택"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <Button 
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-14 text-lg mt-8"
        >
          신용 평가 받기
        </Button>
      </main>
    </div>
  )
}