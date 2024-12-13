"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/button"
import { XCircle } from 'lucide-react'

export default function DenyPageContent() {
  const router = useRouter()

  const handleReturnHome = () => {
    router.push('/')
  }

  return (
    <div className="border shadow-sm bg-white rounded-2xl p-6 max-w-md w-full -mt-60 text-center">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">대출 신청이 거절되었습니다</h1><br/>
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <p className="text-gray-600">
        죄송합니다.<br/> 귀하의 신용평가 결과 대출 신청이 승인되지 않았습니다.<br/> 자세한 내용은 고객 센터로 문의해 주세요.
      </p>
      </div>
      <div className="space-y-4">
        <Button
          onClick={handleReturnHome}
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white"
        >
          홈 화면으로 돌아가기
        </Button>
      </div>
    </div>
  )
}

