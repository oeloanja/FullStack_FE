"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/button"

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

export default function CurrentLoanStatus() {
  const [loanDetail, setLoanDetail] = useState<LoanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoanDetail = async () => {
      setIsLoading(true);
      try {
        // Assuming we have the loanId stored somewhere (e.g., in localStorage)
        const loanId = localStorage.getItem('currentLoanId');
        if (!loanId) {
          throw new Error('No current loan found');
        }
        const response = await fetch(`/api/v1/loans/detail/${loanId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch loan details');
        }
        const data = await response.json();
        setLoanDetail(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanDetail();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!loanDetail) return <div>No current loan found.</div>;

  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-5xl mx-auto space-y-4">
        {/* Credit Grade Card */}
        <div className="border shadow-sm bg-white rounded-2xl p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold mb-1">나의 신용등급</h2>
            <p className="text-sm text-gray-500">최근 업데이트 : {new Date().toLocaleDateString()}</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-[#23E2C2] flex items-center justify-center">
            <span className="text-3xl font-bold text-[#23E2C2]">B</span>
          </div>
        </div>

        {/* Loan Status Card */}
        <div className="border shadow-sm bg-white rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">대출 현황</h2>
            <Link href="/borrow-current/repay">
              <Button className="rounded-[10px] text-white text-sm sm:text-base bg-[#23E2C2]">
                대출 상환
              </Button>
            </Link>
          </div>

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
                  <span className="text-[#23E2C2] font-medium">{loanDetail.status}</span>
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
                  <span className="text-gray-500">다음 납부일</span>
                  <span className="font-medium">{new Date(loanDetail.nextPaymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">전체 만기일</span>
                  <span className="font-medium">{new Date(loanDetail.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">출금계좌</span>
                  <span className="font-medium">{loanDetail.accountBank} | {loanDetail.accountNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Repayment Schedule Card */}
        <div className="border shadow-sm rounded-2xl bg-white p-6">
          <h2 className="text-xl font-bold mb-6">상환 예정일</h2>
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
                {/* This part would ideally be populated with actual repayment schedule data */}
                <tr className="border-b-2">
                  <td className="py-4">1회차</td>
                  <td>{new Date(loanDetail.startDate).toLocaleDateString()}</td>
                  <td className="text-right">{(loanDetail.loanAmount / loanDetail.term).toLocaleString()}원</td>
                  <td className="text-right">
                    <span className="text-[#23E2C2]">상환완료</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4">2회차</td>
                  <td>{new Date(loanDetail.nextPaymentDate).toLocaleDateString()}</td>
                  <td className="text-right">{(loanDetail.loanAmount / loanDetail.term).toLocaleString()}원</td>
                  <td className="text-right">
                    <span className="text-red-500">상환대기</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}