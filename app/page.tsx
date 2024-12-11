'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/button"
import { Card } from "@/components/card"

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 sm:space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl">오직</h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                외국인을 위한 금융,<br className="hidden sm:inline" />
                <span className="text-[#23E2C2]">BilliT</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-4">
                직장인 신용대출 최저 5.0%<br className="sm:hidden" /> 최대 500만원
              </p>
            </div>
            <Link href="/auth/select-type">
            <Button variant="outline" className="text-black hover:bg-[#23E2C2]/90 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base hover:text-white">
              회원가입하고 서비스 이용해 보기!
            </Button>
            </Link>
          </div>
          <div className="relative aspect-[4/3] rounded-lg mt-8 md:mt-0 overflow-hidden">
            <Image
              src="/main_1.jpg"
              alt="Unity and cooperation represented by joined hands"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex justify-center items-center gap-8 sm:gap-12">
        <div className="relative h-8 sm:h-12 w-24 sm:w-32">
          <Image
            src="/TossBank-Logo.png"
            alt="Toss Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="relative h-8 sm:h-14 w-24 sm:w-32">
          <Image
            src="/HK-Logo.png"
            alt="HK Logo"
            fill
            className="object-contain "
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 bg-[#F7F7F7]">
        <Card className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          <div className="md:w-1/2 aspect-video relative rounded-lg overflow-hidden">
            <Image
              src="/loan_1.jpg"
              alt="Financial transaction showing Euro banknotes"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-1/2 space-y-2 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-4xl font-bold text-[#23E2C2]">대출하기</h3>
            <p className="text-sm ml-1 sm:text-base text-gray-600">
              출근길에 신청하면<br className="sm:hidden" /> 퇴근길에 송금완료
            </p>
            <Link href="/detail/borrow">
              <Button className="rounded-full text-sm mt-4 sm:text-base bg-white hover:bg-[#23E2C2] hover:text-white">
                더 알아보기
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-6">
          <div className="md:w-1/2 aspect-video relative rounded-lg overflow-hidden">
            <Image
              src="/investment_1.jpg"
              alt="Professional business handshake"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-1/2 space-y-2 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-4xl font-bold text-[#23E2C2]">투자하기</h3>
            <p className="text-sm ml-1 sm:text-base text-gray-600">
              P2P 대출, 수익성 UP!<br className="sm:hidden" /> 분산투자, 리스크 DOWN!
            </p>
            <Link href="/detail/invest">
              <Button className="rounded-full mt-4 text-sm sm:text-base bg-white hover:bg-[#23E2C2] hover:text-white">
                더 알아보기
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Chatbot Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
        <h2 className="text-xl sm:text-2xl font-bold">
          당신을 도울 <span className="text-[#23E2C2]">똑똑한 챗봇</span>
        </h2>
        <Card className="max-w-2xl mx-auto mt-6 sm:mt-8 p-4 sm:p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                src="/chatbot-image.png"
                alt="AI Chatbot"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <Link href="/auth/select-type">
          <Button variant="outline" className="w-full text-black hover:bg-[#23E2C2]/90 rounded-full text-sm sm:text-base hover:text-white">
          회원가입하고 챗봇 사용해보기
          </Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}

