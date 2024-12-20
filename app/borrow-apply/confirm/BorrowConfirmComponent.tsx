"use client"

import { useEffect, useState } from 'react'
import { getLoanConditions } from './actions'
import LoanConfirmationForm from './LoanConfirmationForm'
import { useSearchParams } from 'next/navigation'

type LoanConditions = {
  target: number;
  maxLoanAmount: number;
  interestRate: number;
  monthlyPayment: number;
};

export default function BorrowConfirmComponent() {
  const [loanConditions, setLoanConditions] = useState<LoanConditions | null>(null)
  const searchParams = useSearchParams()
  const period = parseInt(searchParams.get('period') || '12') // 기본값 12개월

  useEffect(() => {
    const fetchLoanConditions = async () => {
      const storedData = localStorage.getItem('creditEvaluationResult')
      if (storedData) {
        const { target } = JSON.parse(storedData)
        const conditions = await getLoanConditions(period, target)
        setLoanConditions(conditions)
      }
    }
    fetchLoanConditions()
  }, [period])

  if (!loanConditions) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">대출 조건 확인</h1>
        
        {/* 진행 상황 바 */}
        <div className="bg-gray-100 rounded-[60px] py-8 px-6 relative mb-12">
          <div className="flex justify-between items-center relative pt-2">
            {/* 점선 */}
            <div className="absolute top-[18px] left-0 right-0 flex justify-between px-8 pt-5">
              {[...Array(33)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full bg-[#23E2C2]`}
                />
              ))}
            </div>

            {/* 진행 원형과 라벨 */}
            <div className="flex justify-between w-full relative z-10 pt-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">대출 정보 입력</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">신용 평가</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">대출 조건 확인</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-[#23E2C2] rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">예상 한도</div>
            <div className="text-2xl font-bold text-[#23E2C2]">{loanConditions.maxLoanAmount.toLocaleString()}원</div>
          </div>
          
          <div className="border border-[#23E2C2] rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">예상 금리</div>
            <div className="text-2xl font-bold text-[#23E2C2]">{loanConditions.interestRate}%</div>
          </div>
          
          <div className="border border-[#23E2C2] rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">월 상환금액</div>
            <div className="text-2xl font-bold text-[#23E2C2]">{loanConditions.monthlyPayment.toLocaleString()}원</div>
          </div>
        </div>

        <div className="border border-[#23E2C2] rounded-lg p-6 text-center mb-8">
          <div className="text-gray-500 text-sm mb-2">선택한 상환 기간</div>
          <div className="text-2xl font-bold text-[#23E2C2]">{period}개월</div>
        </div>

        <LoanConfirmationForm 
          period={period} 
          interestRate={loanConditions.interestRate}
          maxLoanAmount={loanConditions.maxLoanAmount}
        />
      </main>
    </div>
  )
}

