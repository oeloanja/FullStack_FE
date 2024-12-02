"use client"

import { useRef, useState } from "react"
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { useUser } from "@/contexts/UserContext"
import { toast } from 'react-hot-toast'
import { formatNumber, parseNumber } from '@/utils/numberFormat'

export default function LoanConfirmationForm({ period }: { period: number }) {
  const router = useRouter()
  const loanAmountRef = useRef<HTMLInputElement>(null)
  const { userBorrowId } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanAmount = loanAmountRef.current?.value;

    if (!userBorrowId) {
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
      userBorrowId: userBorrowId,
      accountBorrowId: parseInt(localStorage.getItem('selectedAccountId') || '0'),
      loanAmount: loanAmountInWon,
      term: period
    };

    if (!loanRequestData.accountBorrowId) {
      console.error('선택된 계좌 ID를 찾을 수 없습니다.');
      toast.error('선택된 계좌 정보를 찾을 수 없습니다. 계좌를 다시 선택해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        return;
      }

      const response = await api.post('/api/v1/loan-service/register/success', loanRequestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API 응답:', response.data); // 응답 데이터 확인

      if (response.data && response.data.loanId) {
        // loanId를 로컬 스토리지에 저장
        localStorage.setItem('loanId', response.data.loanId.toString());
        console.log('저장된 loanId:', response.data.loanId);
        
        // 대출 금액을 로컬 스토리지에 저장
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

function getToken() {
  // 토큰 가져오는 로직 추가
  return localStorage.getItem('token');
}

