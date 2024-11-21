"use client"

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from "@/components/button"
import { useUser } from "@/contexts/UserContext"
import api from '@/utils/api'
import { useToken } from '@/contexts/TokenContext'
import { useRouter } from 'next/navigation'

interface LoanResponseDto {
  loanId: number
  userBorrowId: number
  groupId: number | null
  loanAmount: number
  term: number
  intRate: number
  issueDate: string | null
  createdAt: string
  statusType: LoanStatusType
}

enum LoanStatusType {
  WAITING = 'WAITING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

const loanStatusDescriptions: { [key in LoanStatusType]: string } = {
  [LoanStatusType.WAITING]: '대출 희망',
  [LoanStatusType.EXECUTING]: '실행 중',
  [LoanStatusType.COMPLETED]: '상환 완료',
  [LoanStatusType.OVERDUE]: '연체',
  [LoanStatusType.REJECTED]: '거절',
  [LoanStatusType.CANCELED]: '취소됨'
}

const getLoanStatusColor = (statusType: LoanStatusType): string => {
  switch (statusType) {
    case LoanStatusType.WAITING: return 'text-blue-500'
    case LoanStatusType.EXECUTING: return 'text-[#23E2C2]'
    case LoanStatusType.COMPLETED: return 'text-green-500'
    case LoanStatusType.OVERDUE: return 'text-red-500'
    case LoanStatusType.REJECTED: return 'text-gray-500'
    case LoanStatusType.CANCELED: return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

export default function LoanHistoryPage() {
  const { userBorrowId } = useUser()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('전체보기')
  const [loanHistory, setLoanHistory] = useState<LoanResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useToken()
  const router = useRouter()

  useEffect(() => {
    const fetchLoanHistory = async () => {
      setIsLoading(true)
      try {
        if (!userBorrowId) {
          throw new Error('사용자 ID를 찾을 수 없습니다')
        }
        const response = await api.get(`/api/v1/loans/history/${userBorrowId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('API 응답 데이터:', response.data)
        setLoanHistory(response.data)
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
  }, [userBorrowId, token])

  const formatLoanPeriod = (createdAt: string, term: number) => {
    const date = new Date(createdAt)
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').slice(0, -1)
    return `${formattedDate}, ${term}개월`
  }

  const filterLoanHistory = (history: LoanResponseDto[], filter: string) => {
    if (filter === '전체보기') return history
    return history.filter(loan => loanStatusDescriptions[loan.statusType] === filter)
  }

  const filteredLoanHistory = filterLoanHistory(loanHistory, selectedFilter)

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
                <Button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none"
                  onClick={() => {
                    setSelectedFilter('전체보기')
                    setIsDropdownOpen(false)
                  }}
                >
                  전체보기
                </Button>
                {Object.values(loanStatusDescriptions).map((description) => (
                  <Button
                    key={description}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-none"
                    onClick={() => {
                      setSelectedFilter(description)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {description}
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
              {filteredLoanHistory.map((loan) => (
                <tr key={loan.loanId} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4">{formatLoanPeriod(loan.createdAt, loan.term)}</td>
                  <td className="py-4 px-4">{loan.loanAmount.toLocaleString()}원</td>
                  <td className="py-4 px-4">{loan.intRate.toFixed(2)}%</td>
                  <td className="py-4 px-4 text-right">
                    <span className={getLoanStatusColor(loan.statusType)}>
                      {loanStatusDescriptions[loan.statusType]}
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