"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from "react-hook-form"
import { useAuth } from "@/contexts/AuthContext"
import api from '@/utils/api'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/dialog"
import Script from 'next/script'
import { formatNumber, parseNumber } from '@/utils/numberFormat';

interface Account {
  accountId: number
  bankName: string
  accountNumber: string
}

declare global {
  interface Window {
    daum: any;
  }
}

export default function LoanApplicationForm() {
  const router = useRouter()
  const { user, token } = useAuth()
  const incomeFileInputRef = useRef<HTMLInputElement>(null)
  const employmentFileInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      postcode: "",
      roadAddress: "",
      jibunAddress: "",
      detailAddress: "",
      extraAddress: "",
      accountNumber: "",
      selectedReason: "",
      selectedPeriod: "6개월",
      selectedAccount: null as Account | null,
      incomeFile: null,
      employmentFile: null,
      loanAmount: ""
    }
  })

  const reasons = [
    "채무정리", "신용카드", "주택개선(리모델링)", "대환 구매", "의료", "사업",
    "차량 구매", "휴가", "이주", "집 구매", "결혼", "교육", "기타"
  ]

  const periods = ["3개월", "6개월", "12개월"]

  const onSubmit = async (data) => {
    console.log('onSubmit 함수 시작');
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!selectedAccountId) {
      toast.error('계좌를 선택해주세요.');
      setIsSubmitting(false);
      return;
    }

    if (!user?.userBorrowId) {
      toast.error('사용자 정보를 찾을 수 없습니다.');
      setIsSubmitting(false);
      return;
    }

    const loanAmount = parseNumber(data.loanAmount);
    if (isNaN(loanAmount) || loanAmount <= 0) {
      toast.error('올바른 대출 금액을 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    // 선택된 기간을 월 단위의 숫자로 변환
    const termInMonths = parseInt(data.selectedPeriod);

    // 대출 신청 데이터 준비
    const loanApplicationData = {
      userBorrowId: user.userBorrowId,
      accountBorrowId: selectedAccountId,
      loanAmount: loanAmount,
      term: termInMonths
    };

    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('loanApplicationData', JSON.stringify(loanApplicationData));
    
    console.log('저장된 대출 신청 데이터:', localStorage.getItem('loanApplicationData'));

    // 신용 평가 페이지로 이동
    router.push('/borrow-apply/credit');
    setIsSubmitting(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setValue(fieldName, file)
    } else {
      toast.error('PDF 파일만 업로드 가능합니다.')
    }
  }

  const fetchAccounts = async () => {
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.')
      toast.error('인증 토큰이 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      const response = await api.get(`/api/v1/user-service/accounts/borrow`, {
        params: { userId: user?.userBorrowId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data && Array.isArray(response.data)) {
        const validAccounts = response.data.map(account => ({
          accountId: account.id,
          bankName: account.bankName,
          accountNumber: account.accountNumber
        }));
        setAccounts(validAccounts);
        if (validAccounts.length > 0) {
          setIsModalOpen(true);
        } else {
          alert("현재 등록된 계좌가 없습니다! 계좌 등록을 먼저 진행해 주세요!");
          router.push('/borrow-my-page')
        }
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('계좌 목록 조회 중 오류 발생:', error)
      toast.error('계좌 목록을 불러오는데 실패했습니다.')
      setError('계좌 목록을 불러오는데 실패했습니다.')
    }
  }

  const handleAccountSelect = (account: Account) => {
    if (account && typeof account.accountId !== 'undefined') {
      setValue('selectedAccount', account);
      setSelectedAccountId(account.accountId);
      localStorage.setItem('selectedAccountId', account.accountId.toString());
      setIsModalOpen(false);
    } else {
      console.error('Invalid account data:', account);
      toast.error('계좌 정보가 올바르지 않습니다. 다시 시도해 주세요.');
    }
  };

  const execDaumPostcode = () => {
    if (!isScriptLoaded) {
      toast.error('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data) {
          let addr = '';
          let extraAddr = '';

          if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
          } else {
            addr = data.jibunAddress;
          }

          if(data.userSelectedType === 'R'){
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
              extraAddr += data.bname;
            }
            if(data.buildingName !== '' && data.apartment === 'Y'){
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if(extraAddr !== ''){
              extraAddr = ' (' + extraAddr + ')';
            }
            setValue('extraAddress', extraAddr);
          } else {
            setValue('extraAddress', '');
          }

          setValue('postcode', data.zonecode);
          setValue('roadAddress', addr);
          setValue('jibunAddress', data.jibunAddress);
          
          setValue('detailAddress', '');
        }
      }).open();
    } else {
      toast.error('우편번호 서비스를 불러오지 못했습니다. 페이지를 새로고침 해주세요.');
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
    if (window.daum && window.daum.Postcode) {
      setIsScriptLoaded(true);
    } else {
      const script = document.querySelector('script[src*="daumcdn"]');
      if (script) {
        script.onload = () => setIsScriptLoaded(true);
      }
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-8">
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
      
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
            <Controller
              name="postcode"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="우편번호"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                  readOnly
                />
              )}
            />
            <Button 
              type="button"
              onClick={execDaumPostcode}
              className="bg-[#23E2C2] hover:bg-[#23E2C2]/90 text-white rounded-[10px] px-6"
            >
              우편번호 찾기
            </Button>
          </div>
          <Controller
            name="roadAddress"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="도로명주소"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                readOnly
              />
            )}
          />
          <Controller
            name="jibunAddress"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="지번주소"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                readOnly
              />
            )}
          />
          <Controller
            name="detailAddress"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="상세주소"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
              />
            )}
          />
          <Controller
            name="extraAddress"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="참고항목"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                readOnly
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
          <h2 className="text-sm font-medium text-gray-600 mb-2">대출 금액</h2>
          <Controller
            name="loanAmount"
            control={control}
            rules={{ required: '대출 금액을 입력해주세요.' }}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                placeholder="대출 희망 금액 (원)"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-sm"
                value={formatNumber(value)}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
            )}
          />
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
                    {field.value ? `${field.value.bankName} | ${field.value.accountNumber}` : '대출금 입금 계좌'}
                  </span>
                )}
              />
            </div>
            <Button 
              type="button"
              onClick={fetchAccounts}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? '처리 중...' : '신용 평가 받기'}
      </Button>

      {/* Account Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>계좌 선택</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {accounts.map((account) => (
              <Button
                key={account.accountId}
                onClick={() => account.accountId !== undefined ? handleAccountSelect(account) : null}
                className="w-full mb-2 text-left justify-start"
              >
                {account.bankName} | {account.accountNumber}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </form>
  )
}

