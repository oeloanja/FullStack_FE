"use server"

export async function getLoanConditions(period: number) {
  // 기간에 따른 대출 조건 계산
  const baseAmount = 5000000
  const baseRate = 18
  
  // 기간에 따른 월 상환금액 계산
  // 원리금균등상환방식 적용
  const monthlyInterestRate = baseRate / 12 / 100
  const monthlyPayment = Math.round(
    (baseAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, period)) /
    (Math.pow(1 + monthlyInterestRate, period) - 1)
  )

  return {
    maxLoanAmount: baseAmount,
    interestRate: baseRate,
    monthlyPayment: monthlyPayment,
  }
}