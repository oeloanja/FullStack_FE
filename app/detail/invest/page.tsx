import { Button } from "@/components/button"
import { Card } from "@/components/card"
//import { MessageCircle } from 'lucide-react'

export default function Component() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-12">
          은행보다, <span className="text-[#23E2C2]">BilliT</span>
        </h1>
        
        <Card className="max-w-2xl mx-auto p-8 relative mb-8">
          <div className="w-full aspect-video  bg-gray-200 rounded-lg" /> {/* Placeholder for image */}
        </Card>
        
        <Button className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-full px-8 py-6 text-lg">
          회원가입 하고 투자 시작하기
        </Button>
      </section>
      
      {/* Features Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 bg-[#F7F7F7]">
        <Card className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
        <div className="md:w-1/2 aspect-video bg-gray-100 rounded-lg" />
          <div className="md:w-1/2 space-y-2 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">중위험 중수익으로밸런스 있게</h3>
            <p className="text-sm sm:text-base text-gray-600">
            불확실한 시장에서 <br className="sm:hidden" /> 중위험 / 중수익의 개인신용채권 투자
            </p>
            <Button className="rounded-full text-sm bg-white sm:text-base hover:bg-[#23E2C2]">
              투자 시작하기
            </Button>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 flex flex-col md:flex-row-reverse items-center gap-4 sm:gap-6">
        <div className="md:w-1/2 aspect-video bg-gray-100 rounded-lg" />
          <div className="md:w-1/2 space-y-2 sm:space-y-4 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">분산투자로리스크 관리</h3>
            <p className="text-sm sm:text-base text-gray-600">
            채무불이행으로 인한 손실 걱정 NO!<br/> 여러명의 채무자에게 투자하여 <br className="sm:hidden" />
            손실율을 줄였습니다.
            </p>
            <Button className="rounded-full text-sm sm:text-base bg-white hover:bg-[#23E2C2]">
            투자 시작하기
            </Button>
          </div>
          
        </Card>
      </section>
    </div>
  )
}