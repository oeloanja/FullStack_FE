'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/button"
import { CheckCircle } from 'lucide-react'

interface LoanData {
  loanAmount: number
  term: number
}

export default function SuccessPage() {
  const router = useRouter()
  const [loanData, setLoanData] = useState<LoanData | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('loanApplicationData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setLoanData({
        loanAmount: parsedData.loanAmount || 0,
        term: parseInt(parsedData.period) || 0
      })
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="border shadow-sm bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">대출 신청 완료!</h1>
          <p className="text-gray-600 mb-6">
            귀하의 대출 신청이 성공적으로 접수되었습니다.
          </p>
          {loanData && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">신청 내역</h2>
              <p className="text-gray-600">대출 금액: {formatCurrency(loanData.loanAmount)}만원</p>
              <p className="text-gray-600">상환 기간: {loanData.term}개월</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-6">
            결과는 등록된 이메일 주소로 발송됩니다.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => router.push('/my-page')}
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
            >
              마이페이지로 이동
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full border-[#23E2C2] text-[#23E2C2] hover:bg-[#23E2C2]/10"
            >
              홈으로 돌아가기
            </Button>
            <Button
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
            >
              대출그룹 신청하기
            </Button>
          </div>
        </div>
      </main>
      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        <p>© 2024 BillIT. All rights reserved.</p>
      </footer>
    </div>
  )
}