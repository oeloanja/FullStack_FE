"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/button"
import { CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/utils/api'
import { useAuth } from "@/contexts/AuthContext"
import axios from 'axios'

interface LoanData {
  loanAmount: number
  term: number
}

interface LoanGroupResponseClientDto {
  groupId: number;
  isFulled: boolean;
}

export default function SuccessPageContent() {
  const router = useRouter()
  const [loanData, setLoanData] = useState<LoanData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const storedData = localStorage.getItem('loanApplicationData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setLoanData({
        loanAmount: parsedData.loanAmount || 0,
        term: parseInt(parsedData.term) || 0
      })
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }

  const handleAssignGroup = async () => {
    const loanId = localStorage.getItem('loanId')
    if (!loanId) {
      console.error('대출 ID가 없습니다.')
      toast.error('대출 정보를 찾을 수 없습니다.')
      return
    }

    setIsLoading(true)

    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await api.put<LoanGroupResponseClientDto>(`/api/v1/loan-service/${loanId}/assign-group`, 
        {
          loanId: parseInt(loanId)
        }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.status === 200 && response.data) {
        console.log('그룹 배정 성공:', response.data)
        toast.success(`대출 그룹 ${response.data.groupId}에 성공적으로 배정되었습니다.`)
        if (response.data.isFulled) {
          toast.success('해당 그룹이 가득 찼습니다. 곧 대출이 실행될 예정입니다.')
        }
        router.push('/') // 홈으로 이동
      } else {
        throw new Error('그룹 배정에 실패했습니다.')
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`대출 그룹 배정 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`)
        } else if (error.request) {
          toast.error('서버로부터 응답이 없습니다. 네트워크 연결을 확인해 주세요.')
        } else {
          toast.error('대출 그룹 배정 요청 중 오류가 발생했습니다.')
        }
      } else {
        toast.error('대출 그룹 배정에 실패했습니다. 다시 시도해 주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoanCancel = async () => {
    const loanId = localStorage.getItem('loanId')
    if (!loanId) {
      console.error('대출 ID가 없습니다.')
      toast.error('대출 정보를 찾을 수 없습니다.')
      return
    }

    setIsLoading(true)

    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다.')
      }

      const response = await api.put('/api/v1/loan-service/status', 
        {
          loanId: parseInt(loanId),
          status: 5
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.status === 200) {
        toast.success('대출이 성공적으로 취소되었습니다.')
        localStorage.removeItem('loanId')
        localStorage.removeItem('loanApplicationData')
        router.push('/')
      } else {
        throw new Error('대출 취소에 실패했습니다.')
      }
    } catch (error) {
      console.error('대출 취소 중 오류 발생:', error)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`대출 취소 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`)
        } else if (error.request) {
          toast.error('서버로부터 응답이 없습니다. 네트워크 연결을 확인해 주세요.')
        } else {
          toast.error('대출 취소 요청 중 오류가 발생했습니다.')
        }
      } else {
        toast.error('대출 취소 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border shadow-sm bg-white rounded-2xl p-6 max-w-md w-full text-center -mt-60">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">대출 신청 마지막 단계!</h1>
      <p className="text-gray-600 mb-6">
        대출 그룹 신청을 하셔야 대출이 완료됩니다.
      </p>
      {loanData && (
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">신청 내역</h2>
          <p className="text-gray-600">대출 금액: {formatCurrency(loanData.loanAmount)}</p>
          <p className="text-gray-600">상환 기간: {loanData.term}개월</p>
        </div>
      )}
      <div className="space-y-4">
        <Button
          onClick={handleAssignGroup}
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '대출 그룹 신청하기'}
        </Button>
        <Button
          onClick={handleLoanCancel}
          variant="outline"
          className="w-full border-[#23E2C2] text-[#23E2C2] hover:bg-[#23E2C2]/10"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '대출 신청 취소하기'}
        </Button>
      </div>
    </div>
  )
}

