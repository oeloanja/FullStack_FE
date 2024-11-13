"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import Link from "next/link"

export default function Component() {
  const [activeTab, setActiveTab] = useState<'borrower' | 'investor'>('borrower')
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <div className="flex-1 flex flex-col h-fit">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-center">로그인</h1>
          
          {/* Login Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('borrower')}
              className={`flex-1 py-2 text-center ${
                activeTab === 'borrower'
                  ? 'text-[#23E2C2] border-b-2 border-[#23E2C2]'
                  : 'text-gray-500'
              }`}
            >
              대출자 로그인
            </button>
            <button
              onClick={() => setActiveTab('investor')}
              className={`flex-1 py-2 text-center ${
                activeTab === 'investor'
                  ? 'text-[#23E2C2] border-b-2 border-[#23E2C2]'
                  : 'text-gray-500'
              }`}
            >
              투자자 로그인
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 text-lg rounded-md"
            >
              로그인
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              
                아이디/PW가 기억나지 않으신가요? <Link 
                href="/forgot-password" 
                className="text-sm text-[#23E2C2]"
              >ID/PW 찾기
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}