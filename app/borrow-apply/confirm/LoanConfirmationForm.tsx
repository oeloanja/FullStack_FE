"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useAuth } from "@/contexts/AuthContext"
import { toast } from 'react-hot-toast'
import { formatNumber, parseNumber } from '@/utils/numberFormat'

export default function LoanConfirmationForm({ period, interestRate, maxLoanAmount }: { period: number, interestRate: number, maxLoanAmount: number }) {
  const router = useRouter()
  const loanAmountRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [maxLoanAmountState, setMaxLoanAmount] = useState<number>(0);

  useEffect(() => {
    // localStorage에서 신용 평가 결과 가져오기
    const storedData = localStorage.getItem('creditEvaluationResult')
    if (storedData) {
      const { target, maxLoanAmount: evaluatedMaxLoanAmount } = JSON.parse(storedData)
      if (target === 2) {
        toast.error('대출이 거절되었습니다.')
        router.push('/borrow-apply/deny')
      } else {
        let actualMaxLoanAmount: number;
        if (target === 0) {
          actualMaxLoanAmount = 5000000; // 500만원
        } else if (target === 1) {
          actualMaxLoanAmount = 3000000; // 300만원
        } else {
          actualMaxLoanAmount = evaluatedMaxLoanAmount;
        }
        
        setMaxLoanAmount(actualMaxLoanAmount) // maxLoanAmount 상태 설정
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanAmount = loanAmountRef.current?.value;

    if (!user?.userBorrowId) {
      console.error('사용자 ID를 찾을 수 없습니다.');
      toast.error('로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.');
      return;
    }

    if (!loanAmount) {
      console.error('대출 금액이 입력되지 않았습니다.');
      toast.error('올바른 대출 금액을 입력해주세요.');
      return;
    }

    const loanAmountInWon = parseNumber(loanAmount);

    const loanRequestData = {
      userBorrowId: user.userBorrowId,
      accountBorrowId: parseInt(localStorage.getItem('selectedAccountId') || '0'),
      loanAmount: Math.min(loanAmountInWon, maxLoanAmountState),
      term: period,
      intRate: interestRate,
      loanLimit: maxLoanAmountState // 예상 한도 추가
    };

    if (!loanRequestData.accountBorrowId) {
      console.error('선택된 계좌 ID를 찾을 수 없습니다.');
      toast.error('선택된 계좌 정보를 찾을 수 없습니다. 계좌를 다시 선택해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/api/v1/loan-service/register/success', loanRequestData);

      console.log('API 응답:', response.data);

      if (response.data && response.data.loanId) {
        localStorage.setItem('loanId', response.data.loanId.toString());
        console.log('저장된 loanId:', response.data.loanId);
        
        const updatedLoanData = {
          ...JSON.parse(localStorage.getItem('loanApplicationData') || '{}'),
          loanAmount: loanAmountInWon,
          loanId: response.data.loanId
        };
        localStorage.setItem('loanApplicationData', JSON.stringify(updatedLoanData));
        
        router.push('/borrow-apply/success');
      } else {
        throw new Error('API 응답에 loanId가 없습니다.');
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      toast.error('대출 신청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="py-6">
        <input
          ref={loanAmountRef}
          type="text"
          placeholder="대출 희망 금액 입력 (원)"
          className="w-full h-12 px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
          onChange={(e) => {
            const formatted = formatNumber(e.target.value);
            if (loanAmountRef.current) {
              loanAmountRef.current.value = formatted;
            }
          }}
        />
      </div>
      
      <button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg py-4 text-lg mb-2 disabled:opacity-50"
      >
        {isLoading ? '처리 중...' : '대출 신청 완료하기'}
      </button>

      <p className="text-center text-xs text-gray-500">
        *해당 버튼을 눌러야만 <span className="text-[#23E2C2]">대출 신청</span>이 완료됩니다!
      </p>
    </form>
  )
}

