'use client'

import Link from "next/link"
import { HandCoins, Users } from "lucide-react"

export default function SelectTypePage() {
  return (
    <div className="w-full max-w-7xl mx-auto text-center">
      <div className="space-y-2 mb-12">
        <p className="text-[#23E2C2] text-lg">회원 유형 선택</p>
        <h1 className="text-4xl font-bold">무엇을 위해 오셨나요?</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link 
          href="/auth/signup/borrow"
          className="group relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-[#23E2C2] hover:bg-[#23E2C2] transition-colors aspect-[3/2]"
        >
          <HandCoins className="w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 text-[#23E2C2] group-hover:text-white transition-colors" />
          <span className="text-xl sm:text-2xl font-semibold text-[#23E2C2] group-hover:text-white transition-colors">
            대출하러 왔어요
          </span>
        </Link>

        <Link 
          href="/auth/signup/invest"
          className="group relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-[#23E2C2] hover:bg-[#23E2C2] transition-colors aspect-[3/2]"
        >
          <Users className="w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8 text-[#23E2C2] group-hover:text-white transition-colors" />
          <span className="text-xl sm:text-2xl font-semibold text-[#23E2C2] group-hover:text-white transition-colors">
            투자하러 왔어요
          </span>
        </Link>
      </div>

      <div className="mt-12 text-gray-600 text-lg">
        이미 회원이신가요?{" "}
        <Link href="/auth/login" className="text-[#23E2C2] hover:underline">
          로그인하기
        </Link>
      </div>
    </div>
  )
}