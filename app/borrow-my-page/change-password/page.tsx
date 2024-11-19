"use client"

import { useState } from "react"
import { Button } from "@/components/button"

export default function ChangePassword() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  const handleEmailVerification = () => {
    // Here you would typically verify the email
    setIsEmailVerified(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    // Handle password change logic here
    console.log("Password change submitted")
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">비밀번호 변경</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">이메일</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해 주세요"
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
              disabled={isEmailVerified}
            />
            <Button
              type="button"
              onClick={handleEmailVerification}
              disabled={isEmailVerified}
              className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white px-6"
            >
              이메일 확인
            </Button>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600">비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12 mt-4"
        >
          비밀번호 변경 완료
        </Button>
      </form>
    </div>
  )
}