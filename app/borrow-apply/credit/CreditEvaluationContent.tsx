"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { toast } from 'react-hot-toast'

export default function CreditEvaluationContent() {
  const router = useRouter()
  const [isEvaluating, setIsEvaluating] = useState(true)

  useEffect(() => {
    const evaluateCredit = async () => {
      try {
        const loanData = localStorage.getItem('loanApplicationData');
        if (!loanData) {
          toast.error('대출 신청 정보를 찾을 수 없습니다.');
          router.push('/borrow-apply');
          return;
        }

        const { phoneNumber, purpose, loanAmount, term } = JSON.parse(loanData);

        // 신용 평가 API 호출
        const evaluateResponse = await api.post('/api/v1/credit/evaluate', {
          phoneNumber,
          purpose,
          amount: loanAmount,
          term
        });

        if (evaluateResponse.data) {
          localStorage.setItem('creditEvaluationResult', JSON.stringify(evaluateResponse.data));

          // 대출 거절 케이스 처리
          if (evaluateResponse.data.target === 2) {
            toast.error('대출이 거절되었습니다.');
            router.push('/borrow-apply/deny');
          } else {
            router.push(`/borrow-apply/confirm?period=${term}`);
          }
        } else {
          throw new Error('신용 평가 결과를 받지 못했습니다.');
        }
      } catch (error) {
        console.error('신용 평가 중 오류 발생:', error);
        toast.error('신용 평가 중 오류가 발생했습니다.');
        router.push('/borrow-apply');
      } finally {
        setIsEvaluating(false);
      }
    };

    evaluateCredit();
  }, [router]);

  if (!isEvaluating) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 mt-20">
      <p className="text-[#23E2C2] text-lg">
        신용등급 평가 중<br />
        잠시만 기다려주세요.
      </p>
      
      {/* Loading Spinner */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#23E2C2] rounded-full border-t-transparent animate-spin" />
      </div>
    </div>
  )
}

