'use client'

import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import api, { handleApiError } from '../lib/api'

export const LoanList: React.FC = () => {
  const { addToast } = useToast()
  const [loans, setLoans] = useState([])

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get('/api/v1/loans')
        setLoans(response.data)
      } catch (error) {
        const { message, details } = handleApiError(error)
        addToast('error', message, details)
      }
    }

    fetchLoans()
  }, [addToast])

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">대출 목록</h2>
      {loans.map((loan) => (
        <div key={loan.id} className="border p-4 mb-4 rounded">
          <h3 className="font-bold">{loan.purpose}</h3>
          <p>대출 금액: {loan.amount}원</p>
          <p>이자율: {loan.interestRate}%</p>
          <p>상환 기간: {loan.term}개월</p>
          <p>상태: {loan.status}</p>
        </div>
      ))}
    </div>
  )
}

