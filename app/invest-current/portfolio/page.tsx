"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/button"
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useUser } from "@/contexts/UserContext"
import api from '@/utils/api'
import { getToken } from '@/utils/auth'
import { toast } from 'react-hot-toast'
import type { Investment, InvestmentPortfolio } from '@/types/portpolio'

export default function PortfolioPage() {
  const { userInvestId } = useUser()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [portfolio, setPortfolio] = useState<InvestmentPortfolio | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<'전체보기' | '투자 중' | '상환 완료' | '투자 대기'>('전체보기')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPortfolio = async () => {
    try {
      const token = getToken()
      if (!token || !userInvestId) {
        toast.error('로그인이 필요합니다.')
        return
      }

    const response = await api.get(`/api/v1/invest-service/portfolios/${userInvestId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data) {
      setPortfolio(response.data)
    } else {
      throw new Error('포트폴리오 데이터가 없습니다.')
    }
  } catch (error) {
    console.error('포트폴리오 조회 중 오류:', error)
    if (error.response && error.response.status === 404) {
      toast.error('포트폴리오가 존재하지 않습니다. 투자를 먼저 진행해주세요.')
    } else {
      toast.error('포트폴리오 정보를 불러오는데 실패했습니다.')
    }
  }
}

  const fetchInvestments = async () => {
    try {
      const token = getToken()
      if (!token || !userInvestId) {
        toast.error('로그인이 필요합니다.')
        return
      }

      console.log('Fetching investments for user:', userInvestId) // 디버깅용

      const response = await api.get(`/api/v1/invest-service/investments/user/${userInvestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (Array.isArray(response.data)) {
        setInvestments(response.data)
      } else {
        console.error('Invalid investments data:', response.data)
        throw new Error('투자 목록 데이터 형식이 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('투자 목록 조회 중 상세 오류:', error)
      toast.error('투자 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!userInvestId) {
      console.error('사용자 ID가 없습니다.')
      toast.error('사용자 정보를 찾을 수 없습니다.')
      return
    }
    
    fetchPortfolio()
    fetchInvestments()
  }, [userInvestId])

  const filteredInvestments = selectedFilter === '전체보기' 
    ? investments 
    : investments.filter(inv => inv.status === selectedFilter)

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col space-y-6 p-6 min-h-screen">
      {/* Summary Card */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">투자 포트폴리오</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">총 투자금액</p>
            <p className="text-xl font-bold">
              {portfolio?.totalInvestedAmount.toLocaleString()}원
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">진행중인 투자</p>
            <p className="text-xl font-bold">
              {investments.filter(inv => inv.status === '투자 중').length}건
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">평균 수익률</p>
            <p className="text-xl font-bold text-[#23E2C2]">
              {portfolio?.totalReturnRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">총 수익금</p>
            <p className="text-xl font-bold text-[#23E2C2]">
              {portfolio?.totalReturnValue.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="border shadow-sm bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">투자 이력</h2>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="text-[#23E2C2] border-[#23E2C2] hover:bg-[#23E2C2] hover:text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{selectedFilter}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                {['전체보기', '투자 중', '상환 완료', '투자 대기'].map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedFilter(option as typeof selectedFilter)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#23E2C2] text-white">
              <tr>
                <th className="py-3 px-4 text-center">대출그룹 이름</th>
                <th className="py-3 px-4 text-center">투자금액</th>
                <th className="py-3 px-4 text-center">평균신용도</th>
                <th className="py-3 px-4 text-center">기대 수익률</th>
                <th className="py-3 px-4 text-center">실제 수익률</th>
                <th className="py-3 px-4 text-center">투자기간</th>
                <th className="py-3 px-4 text-center">투자상태</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map((investment) => (
                <tr key={investment.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4 text-center">{investment.groupName}</td>
                  <td className="py-4 px-4 text-center">{investment.amount.toLocaleString()}원</td>
                  <td className="py-4 px-4 text-center">{investment.grade}</td>
                  <td className="py-4 px-4 text-center">{investment.expectedRate}%</td>
                  <td className="py-4 px-4 text-center">{investment.actualRate}%</td>
                  <td className="py-4 px-4 text-center">{investment.period}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      investment.status === '투자 중' ? 'bg-green-100 text-green-800' :
                      investment.status === '상환 완료' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {investment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Link href={`/invest-current/portfolio/detail/${investment.id}`}>
                      <Button
                        size="sm"
                        className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
                      >
                        상세보기
                      </Button>
                    </Link>
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

