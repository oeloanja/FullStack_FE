export interface InvestmentPortfolio {
  portfolioId: number
  userInvestorId: number
  totalInvestedAmount: number
  totalReturnValue: number
  totalReturnRate: number
  createdAt: string
}

export interface Investment {
  id: number
  groupName: string
  amount: number
  grade: string
  expectedRate: number
  actualRate: number
  //period: string
  status: '투자 중' | '상환 완료' | '투자 대기' | '투자 취소'
}

export interface InvestmentDetail extends Investment {
  nextPaymentDate: string
  maturityDate: string
  accountInfo: string
  completionPercentage: number
  payments: PaymentStatus[]
}

export interface PaymentStatus {
  number: number
  date: string
  amount: number
  returns: number
  status: '정산완료' | '정산예정'
}

export interface InvestmentResponse {
  investmentId: number
  groupId: number
  userInvestorId: number
  accountInvestorId: number
  investmentAmount: number
  investmentDate: string
  expectedReturnRate: number
  createdAt: string
  investStatusType: number
  settlementRatio: number
  actualReturnRate: number
}

