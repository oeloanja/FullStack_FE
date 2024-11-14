export default function Component() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <main className="flex-1 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">대출 조건 확인</h1>
        
        {/* Progress Bar */}
        <div className="bg-gray-100 rounded-[80px] py-8 px-6 relative mb-12">
          <div className="flex justify-between items-center relative">
            {/* Dotted line */}
            <div className="absolute top-[18px] left-0 right-0 flex justify-between px-8">
              {[...Array(33)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full bg-[#23E2C2]`}
                />
              ))}
            </div>

            {/* Progress circles and labels */}
            <div className="flex justify-between w-full relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">대출 정보 입력</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">신용 평가</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#23E2C2] mb-3" />
                <span className="text-sm font-medium text-[#23E2C2]">대출 조건 확인</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Information Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border border-[#23E2C2] rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">예상 한도</div>
            <div className="text-2xl font-bold text-[#23E2C2]">500만원</div>
          </div>
          
          <div className="border border-[#23E2C2] rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">예상 금리</div>
            <div className="text-2xl font-bold text-[#23E2C2]">18%</div>
          </div>
          
          <div className="border border-[#23E2C2] rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm mb-2">월 상환금액</div>
            <div className="text-2xl font-bold text-[#23E2C2]">491,667원</div>
          </div>
        </div>
        <div className="py-6">
          <input
                type="text"
                placeholder="대출 희망 금액 입력"
                className="w-full h-12 px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm" />
        </div>
        {/* Apply Button */}
        <button className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-lg py-4 text-lg mb-2">
          대출 신청 완료하기
        </button>

        {/* Note */}
        <p className="text-center text-xs text-gray-500">
          *해당 버튼을 눌러야만 <a className="text-[#23E2C2]">대출 신청</a>이 완료됩니다!
        </p>
      </main>
    </div>
  )
}