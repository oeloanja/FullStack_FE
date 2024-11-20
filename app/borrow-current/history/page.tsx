"use client"

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/button"
import { useUser } from "@/contexts/UserContext"
import { fetchWithAuth } from '@/utils/api'

interface LoanHistory {
  loanId: number
  userBorrowId: number
  groupId: number | null
  loanAmount: number
  term: number
  intRate: number
  issueDate: string | null
  createdAt: string
  statusType: string
}

const getLoanStatusColor = (statusType: string): string => {
  switch (statusType) {
    case 'WAITING': return 'text-blue-500'
    case 'EXECUTING': return 'text-[#23E2C2]'
    case 'COMPLETED': return 'text-green-500'
    case 'OVERDUE': return 'text-red-500'
    case 'REJECTED': return 'text-gray-500'
    case 'CANCELED': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

export default function LoanHistoryPage() {
  const { userBorrowId } = useUser()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('전체보기')
  const [loanHistory, setLoanHistory] = useState<LoanHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLoanHistory = async () => {
      setIsLoading(true)
      try {
        if (!userBorrowId) {
          throw new Error('사용자 ID를 찾을 수 없습니다')
        }
        const data = await fetchWithAuth(`/loan/v1/loans/history/${userBorrowId}`)
        console.log('API 응답 데이터:', data)
        setLoanHistory(data)
      } catch (err) {
        console.error('대출 이력 조회 중 오류 발생:', err)
        setError(err instanceof Error ? err.message : '오류가 발생했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    if (userBorrowId) {
      fetchLoanHistory()
    }
  }, [userBorrowId])

  const formatLoanPeriod = (createdAt: string, term: number) => {
    const date = new Date(createdAt)
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').slice(0, -1)
    return `${formattedDate}, ${term}개월`
  }

  if (isLoading) return <div className="p-4">로딩 중...</div>
  if (error) return <div className="p-4 text-red-500">오류: {error}</div>
  if (!userBorrowId) return <div className="p-4">사용자 정보를 찾을 수 없습니다.</div>

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="border shadow-sm bg-white rounded-2xl p-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold mb-1">나의 신용등급</h2>
          <p className="text-sm text-gray-500">최근 업데이트 : {new Date().toLocaleDateString()}</p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-[#23E2C2] flex items-center justify-center">
          <span className="text-3xl font-bold text-[#23E2C2]">B</span>
        </div>
      </div>

      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">대출 이력</h2>
          <div className="relative">
            <Button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between bg-white text-[#23E2C2] border border-[#23E2C2] hover:bg-[#23E2C2] hover:text-white transition-colors px-4 py-2 rounded-2xl"
            >
              <span className="text-sm mr-2">{selectedFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {['전체보기', '대출 중', '대출 취소', '상환 완료', '대출 희망'].map((option) => (
                  <Button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none"
                    onClick={() => {
                      setSelectedFilter(option)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#23E2C2] text-white rounded-lg">
                <th className="py-3 px-4 text-left font-medium">대출 기간</th>
                <th className="py-3 px-4 text-left font-medium">대출금</th>
                <th className="py-3 px-4 text-left font-medium">금리</th>
                <th className="py-3 px-4 text-right font-medium">대출상태</th>
              </tr>
            </thead>
            <tbody>
              {loanHistory.map((loan) => (
                <tr key={loan.loanId} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4">{formatLoanPeriod(loan.createdAt, loan.term)}</td>
                  <td className="py-4 px-4">{loan.loanAmount.toLocaleString()}원</td>
                  <td className="py-4 px-4">{loan.intRate.toFixed(2)}%</td>
                  <td className="py-4 px-4 text-right">
                    <span className={getLoanStatusColor(loan.statusType)}>
                      {loan.statusType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}