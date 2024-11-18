"use client"

import { useRef } from "react"
import { Button } from "@/components/button"
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from "react-hook-form"

export default function LoanApplicationForm() {
  const router = useRouter()
  const incomeFileInputRef = useRef<HTMLInputElement>(null)
  const employmentFileInputRef = useRef<HTMLInputElement>(null)

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      address: "",
      detailAddress: "",
      accountNumber: "",
      selectedReason: "",
      selectedPeriod: "6개월",
      selectedAccount: null,
      incomeFile: null,
      employmentFile: null
    }
  })

  const reasons = [
    "채무정리", "신용카드", "주택개선(리모델링)", "대환 구매", "의료", "사업",
    "차량 구매", "휴가", "이주", "집 구매", "결혼", "교육", "기타"
  ]

  const periods = ["3개월", "6개월", "12개월"]

  const onSubmit = (data) => {
    localStorage.setItem('loanApplicationData', JSON.stringify(data))
    const periodInMonths = parseInt(data.selectedPeriod);
    router.push(`/borrow-apply/confirm?period=${periodInMonths}`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setValue(fieldName, file)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">마이데이터 불러오기</h2>
          <Button 
            type="button"
            className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
          >
            마이데이터 한 번에 불러오기
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-gray-600">주소 입력</h2>
          <div className="flex gap-2">
            <Button 
              type="button"
              className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] px-6"
            >
              주소 검색
            </Button>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="주소 검색 버튼을 눌러 주소 입력"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                  readOnly
                />
              )}
            />
          </div>
          <Controller
            name="detailAddress"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="상세 주소 입력"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
              />
            )}
          />
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">필수 서류 제출</h2>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".pdf"
              ref={incomeFileInputRef}
              onChange={(e) => handleFileUpload(e, 'incomeFile')}
              className="hidden"
            />
            <Button 
              type="button"
              className="flex-1 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
              onClick={() => incomeFileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {watch('incomeFile') ? '소득증명원 업로드 완료' : '소득증명원 업로드'}
            </Button>
            <input
              type="file"
              accept=".pdf"
              ref={employmentFileInputRef}
              onChange={(e) => handleFileUpload(e, 'employmentFile')}
              className="hidden"
            />
            <Button 
              type="button"
              className="flex-1 bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
              onClick={() => employmentFileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {watch('employmentFile') ? '재직증명서 업로드 완료' : '재직증명서 업로드'}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div className="relative">
          <h2 className="text-sm font-medium text-gray-600 mb-2">대출 신청 사유</h2>
          <Controller
            name="selectedReason"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12 px-4"
              >
                <option className="bg-white text-black text-center" value="">신청 사유를 선택해주세요</option>
                {reasons.map((reason) => (
                  <option className="bg-white text-black" key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="relative">
          <h2 className="text-sm font-medium text-gray-600 mb-2">상환 기간</h2>
          <Controller
            name="selectedPeriod"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12 px-4"
              >
                {periods.map((period) => (
                  <option className="bg-white text-black text-center" key={period} value={period}>{period}</option>
                ))}
              </select>
            )}
          />
          <p className="text-xs text-gray-500 mt-1">* 상환기간은 원리금 균등상환으로 고정됩니다</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-600 mb-2">계좌 정보</h2>
          <div className="border border-dashed border-[#23E2C2] rounded-2xl p-8">
            <div className="text-center mb-4">
              <Controller
                name="selectedAccount"
                control={control}
                render={({ field }) => (
                  <span className="text-gray-600">
                    {field.value ? `${field.value.bank} | ${field.value.accountNumber}` : '대출금 입금 계좌'}
                  </span>
                )}
              />
            </div>
            <Button 
              type="button"
              onClick={() => {
                const currentAccount = watch('selectedAccount');
                if (!currentAccount) {
                  setValue('selectedAccount', {
                    bank: "○○은행",
                    accountNumber: "0000-00-0000-000"
                  });
                }
              }}
              className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-12"
            >
              {watch('selectedAccount') ? "입금 계좌 변경" : "입금 계좌 선택"}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <Button 
        type="submit"
        className="w-full bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] h-14 text-lg mt-8 col-span-2"
      >
        신용 평가 받기
      </Button>
    </form>
  )
}