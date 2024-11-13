"use client"

import { useState } from "react"
import { Button } from "@/components/button"

export default function Component() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  const handleVerifyEmail = () => {
    // Handle email verification
    console.log("Verifying email:", formData.email)
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold text-center">회원가입</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력해 주세요."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
                />
                <Button 
                  type="button"
                  onClick={handleVerifyEmail}
                  className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white px-4 py-2 rounded-md"
                >
                  이메일 중복 검사
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요."
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
              <input
                id="name"
                type="text"
                placeholder="이름을 입력해주세요."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">전화번호</label>
              <input
                id="phone"
                type="tel"
                placeholder="전화번호를 입력해주세요."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#23E2C2] focus:border-[#23E2C2]"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 text-lg rounded-md"
            >
              회원가입 완료
            </Button>
          </form>
        </div>
      </main>

    </div>
  )
}