"use client"

import { useRef } from "react"
import { useRouter } from 'next/navigation'

export function LoanConfirmationForm({ period }: { period: number }) {
  const router = useRouter()
  const loanAmountRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loanAmount = loanAmountRef.current?.value

    if (!loanAmount) {
      console.error('대출 금액이 입력되지 않았습니다.')
      return
    }

    const loanAmountInWon = parseFloat(loanAmount) * 10000 // 만원 단위를 원 단위로 변환

    const loanRequestData = {
      userBorrowId: 1,
      loanAmount: loanAmountInWon,
      term: period
    }

    try {
      const response = await fetch('/api/v1/loans/register/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanRequestData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('대출 신청 성공:', result)
        localStorage.setItem('loanId', result.loanId.toString())
        
        // 대출 금액을 로컬 스토리지에 저장
        const updatedLoanData = JSON.parse(localStorage.getItem('loanApplicationData') || '{}')
        updatedLoanData.loanAmount = loanAmountInWon
        localStorage.setItem('loanApplicationData', JSON.stringify(updatedLoanData))
        
        router.push('/borrow-apply/success')
      } else {
        console.error('대출 신청 실패:', await response.text())
        alert('대출 신청에 실패했습니다. 다시 시도해 주세요.')
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error)
      alert('서버와의 통신 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="py-6">
        <input
          ref={loanAmountRef}
          type="text"
          placeholder="대출 희망 금액 입력 (단위: 만원)"
          className="w-full h-12 px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '')
          }}
        />
      </div>
      
      <button 
        type="submit"
        className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg py-4 text-lg mb-2"
      >
        대출 신청 완료하기
      </button>

      <p className="text-center text-xs text-gray-500">
        *해당 버튼을 눌러야만 <span className="text-[#23E2C2]">대출 신청</span>이 완료됩니다!
      </p>
    </form>
  )
}