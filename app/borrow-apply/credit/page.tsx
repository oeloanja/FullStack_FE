"use client"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">신용 평가</h1>
        
        {/* Progress Bar */}
        <div className="bg-gray-100 rounded-[60px] py-8 px-6 relative mb-12">
          <div className="flex justify-between items-center relative">
            {/* Dotted line */}
            <div className="absolute top-[18px] left-0 right-0 flex justify-between px-8 pt-3">
              {[...Array(33)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full ${i < 17 ? 'bg-[#23E2C2]' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            {/* Progress circles and labels */}
            <div className="flex justify-between w-full relative z-10 pt-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">대출 정보 입력</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">신용 평가</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mb-3" />
                <span className="text-sm font-medium text-gray-400">대출 조건 확인</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex flex-col items-center justify-center space-y-8 mt-20">
          <p className="text-[#23E2C2] text-lg">
            신용등급 평가 중</p>
            잠시만 기다려주세요.
          
          {/* Loading Spinner */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-[#23E2C2] rounded-full border-t-transparent animate-spin" />
          </div>
        </div>
      </main>
    </div>
  )
}