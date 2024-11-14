"use client"

import { useState } from "react"
import { Button } from "@/components/button"

export default function ChangePhoneNumber() {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the phone number change
    console.log("Phone number change submitted:", phoneNumber)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-5xl font-bold text-center mb-8">전화번호 변경</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="phone-number" className="sr-only">전화번호</label>
          <input
            id="phone-number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="새로운 전화번호를 입력해주세요."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm"
            required
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white h-12"
        >
          전화번호 변경 완료
        </Button>
      </form>
    </div>
  )
}