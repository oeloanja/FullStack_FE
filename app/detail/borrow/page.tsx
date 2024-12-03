'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import Link from "next/link"

const images = [
  '/borrow-detail1.png',
  '/borrow-detail2.png', 
  '/borrow-detail3.png'
]

export default function Component() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-12">
          은행이 안되면 그 다음은 <span className="text-[#23E2C2]">BilliT</span>
        </h1>
        
        <Card className="max-w-3xl mx-auto p-8 relative mb-8">
          <div className="w-full aspect-video relative border bg-white rounded-2xl overflow-hidden">
            {images.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`슬라이드 ${index + 1}`}
                fill
                className={`object-contain transition-opacity duration-500  ${
                  currentImage === index ? 'opacity-100' : 'opacity-0'
                }`}
                priority={index === 0}
              />
            ))}
          </div>
        </Card>
        <Link href="../auth/signup/borrow">
        <Button className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-full px-8 py-6 text-lg">
          회원가입 하고 1분안에 대출 한도 알아보기
        </Button>
        </Link>
      </section>
      
      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 bg-[#F7F7F7]">
        <Card className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          <div className="md:w-1/2 aspect-video bg-gray-100 rounded-lg" />
          <div className="md:w-1/2 space-y-2 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">AI와 금융의 만남, <br className="sm:hidden" />손쉬운 신용 산정 </h3>
            <p className="text-sm sm:text-base text-gray-600">
              빡빡한 대출 심사는 이제 Bye~ <br className="sm:hidden" /> BilliT 만의 신용등급평가모델로<br /> 쉽고 간편하게 신용 산정 해드려요.
            </p>
            <Button className="rounded-full text-sm bg-white sm:text-base hover:bg-[#23E2C2]">
              대출 신용 평가 받으러 가기
            </Button>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-6">
          <div className="md:w-1/2 aspect-video bg-gray-100 rounded-lg" />
          <div className="md:w-1/2 space-y-2 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">합리적인 대출 금리</h3>
            <p className="text-sm sm:text-base text-gray-600">
              제 2금융권 대비 <br/> 합리적인 대출금리로 <br className="sm:hidden" />
              여러분의 부담을 덜어드립니다!
            </p>
            <Button className="rounded-full text-sm sm:text-base bg-white hover:bg-[#23E2C2]">
              대출 신용 평가 받으러 가기
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

