"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/button"
import api from '@/utils/api'
import { format, addMonths, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from "@/contexts/AuthContext";

interface LoanDetail {
  loanId: number;
  userBorrowId: number;
  loanAmount: number;
  term: number;
  interestRate: number;
  status: string;
  startDate: string;
  endDate: string;
  nextPaymentDate: string;
  accountBank: string;
  accountNumber: string;
}

interface RepaymentDetail {
  repaymentTimes: number;
  paymentDate: string;
  repaymentAmount: number;
  isRepaymentSuccess: boolean;
}

interface Repayment {
  repaymentId: number;
  groupId: number;
  loanId: number;
  repaymentPrincipal: any; //BigDecimal
  repaymentInterest: any; //BigDecimal
  dueDate: number;
  createdAt: string;
}

export default function CurrentLoanStatus() {
  const { user, token } = useAuth();
  const userBorrowId = user?.userBorrowId;
  const [loanDetail, setLoanDetail] = useState<LoanDetail | null>(null);
  const [repayments, setRepayments] = useState<RepaymentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repaymentInfo, setRepaymentInfo] = useState<Repayment | null>(null);
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | null>(null);
  const [creditRating, setCreditRating] = useState<string>('-');
  const formatDate = (dateString: string | null) => {
    try {
      if (!dateString) {
        console.log('Date string is null or undefined');
        return '날짜 정보 없음';
      }
      // Remove microseconds before parsing
      const cleanDateString = dateString.split('.')[0];
      const date = new Date(cleanDateString);
      
      if (isNaN(date.getTime())) {
        console.log('Invalid date created from string:', dateString);
        return '날짜 정보 없음';
      }
      return format(date, 'yyyy년 MM월 dd일', { locale: ko });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '날짜 정보 없음';
    }
  };
  const calculateEndDate = (startDate: string | null, termMonths: number) => {
    try {
      if (!startDate) {
        console.log('Start date is null or undefined');
        return null;
      }
      const cleanDateString = startDate.split('.')[0];
      const date = new Date(cleanDateString);
      
      if (isNaN(date.getTime())) {
        console.log('Invalid start date:', startDate);
        return null;
      }
      return addMonths(date, termMonths);
    } catch (error) {
      console.error('End date calculation error:', error);
      return null;
    }
  };
  const calculateNextPaymentDate = (createdAt: string | null) => {
    try {
      if (!createdAt) {
        console.log('Missing required data:', { createdAt });
        return null;
      }
      // Remove microseconds before parsing
      const cleanDateString = createdAt.split('.')[0];
      const createdDate = new Date(cleanDateString);
      
      if (isNaN(createdDate.getTime())) {
        console.log('Invalid created date:', createdAt);
        return null;
      }
      // Set next payment date to one month after the created date
      const nextPaymentDate = new Date(createdDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      // If the current date is past the next payment date, move to the next month
      const currentDate = new Date();
      while (currentDate > nextPaymentDate) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    } catch (error) {
      console.error('다음 납부일 계산 중 오류 발생:', error);
      return null;
    }
  };
  const fetchRepayments = async (loanId: number) => {
    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }
      const response = await api.get(`/api/v1/repayment-service/loan/${loanId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        // Ensure we're correctly mapping the isRepaymentSuccess property
        setRepayments(response.data.map((repayment: any) => ({
          repaymentTimes: repayment.repaymentTimes,
          paymentDate: repayment.paymentDate,
          repaymentAmount: repayment.repaymentAmount,
          isRepaymentSuccess: repayment.repaymentSuccess // Changed from repayment.isRepaymentSuccess
        })));
      }
    } catch (error) {
      console.error('상환 내역 조회 중 오류 발생:', error);
      setError('상환 내역을 불러오는데 실패했습니다.');
    }
  };
  const fetchRepaymentInfo = async (loanId: number) => {
    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }
      const response = await api.get('/api/v1/repayment-service', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        // Find the repayment for the current loan
        const currentLoanRepayment = response.data.find(
          (repayment: Repayment) => repayment.loanId === loanId
        );
        setRepaymentInfo(currentLoanRepayment || null);
      }
    } catch (error) {
      console.error('상환 정보 조회 중 오류 발생:', error);
      setError('상환 정보를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!userBorrowId || !token) {
          setError('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
          setIsLoading(false);
          return;
        }
      
        // Fetch credit rating
        const creditResponse = await api.get(`/api/v1/user-service/users/borrow`, {
          params: { userId: userBorrowId },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (creditResponse.data && creditResponse.data.creditRating) {
          const rating = creditResponse.data.creditRating
          let grade = 'C'
          if (rating === 1) grade = 'A'
          else if (rating === 2) grade = 'B'
          setCreditRating(grade)
        }

        const response = await api.get(`/api/v1/loan-service/history/${userBorrowId}/filter`, {
          params: { loanStatus: 1 },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.length > 0) {
          const loanData = response.data[0];
          setLoanDetail(loanData);
          await fetchRepaymentInfo(loanData.loanId);
          await fetchRepayments(loanData.loanId);
        } else {
          setLoanDetail(null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userBorrowId, token]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-5xl mx-auto space-y-4">
        {/* Credit Grade Card */}
        <div className="border shadow-sm bg-white rounded-2xl p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-1">나의 신용등급</h2>
            <p className="text-sm text-gray-500">최근 업데이트 : {format(new Date(), 'yyyy. MM. dd.', { locale: ko })}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#23E2C2] flex items-center justify-center">
            <span className="text-3xl font-bold text-[#23E2C2]">{creditRating}</span>
          </div>
        </div>
        {/* Loan Status Card */}
        <div className="border shadow-sm bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">대출 현황</h2>
            {loanDetail && (
              <Link href="/borrow-current/repay">
                <Button className="rounded-[10px] text-white text-sm sm:text-base bg-[#23E2C2]">
                  대출 상환
                </Button>
              </Link>
            )}
          </div>
          {loanDetail ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div className="border shadow-sm rounded-2xl p-4">
                <h3 className="font-bold text-gray-600 pb-2">기본 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">대출금</span>
                    <span className="font-medium">{loanDetail.loanAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">대출상태</span>
                    <span className="text-[#23E2C2] font-medium">대출 진행 중</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">대출기간</span>
                    <span className="font-medium">{loanDetail.term}개월</span>
                  </div>
                </div>
              </div>
              {/* Status Info */}
              <div className="border shadow-sm rounded-2xl p-4">
                <h3 className="font-bold text-gray-600 pb-2">상환 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">대출 시작일</span>
                    <span className="font-medium">
                      {repaymentInfo?.createdAt ? formatDate(repaymentInfo.createdAt) : '날짜 정보 없음'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">다음 납부일</span>
                    <span className="font-medium">
                      {repaymentInfo && repaymentInfo.createdAt ? 
                        (() => {
                          const nextDate = calculateNextPaymentDate(repaymentInfo.createdAt);
                          return nextDate ? formatDate(nextDate.toISOString()) : '날짜 정보 없음';
                        })()
                        : '날짜 정보 없음'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">전체 만기일</span>
                    <span className="font-medium">
                      {repaymentInfo?.createdAt ? 
                        formatDate(calculateEndDate(repaymentInfo.createdAt, loanDetail.term)?.toISOString()) 
                        : '날짜 정보 없음'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              현재 진행중인 대출이 없습니다!
            </div>
          )}
        </div>

        {loanDetail && (
          <div className="border shadow-sm rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold mb-6">상환 내역</h2>
            {repayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b-2">
                      <th className="text-left pb-4">회차</th>
                      <th className="text-left pb-4">상환일</th>
                      <th className="text-right pb-4">상환금액</th>
                      <th className="text-right pb-4">상환상태</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm border-b-2">
                    {repayments.map((repayment) => (
                      <tr key={repayment.repaymentTimes} className="border-b last:border-b-0">
                        <td className="py-4">{repayment.repaymentTimes}회차</td>
                        <td>{formatDate(repayment.paymentDate)}</td>
                        <td className="text-right">{repayment.repaymentAmount.toLocaleString()}원</td>
                        <td className="text-right">
                          <span className={`${
                            repayment.isRepaymentSuccess ? 'text-[#23E2C2]' : 'text-red-500'
                          }`}>
                            {repayment.isRepaymentSuccess ? '상환완료' : '상환실패'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                현재 상환 기록이 없습니다.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

