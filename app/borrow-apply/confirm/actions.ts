"use server"

type CreditEvaluationResult = {
  target: 0 | 1 | 2;
  maxLoanAmount: number;
  interestRate: number;
};

export async function getLoanConditions(period: number): Promise<CreditEvaluationResult & { monthlyPayment: number }> {
  // localStorage에서 신용 평가 결과 가져오기
  const storedData = typeof window !== 'undefined' ? localStorage.getItem('creditEvaluationResult') : null;
  const evaluationResult: CreditEvaluationResult = storedData 
    ? JSON.parse(storedData) 
    : { target: 0, maxLoanAmount: 5000000, interestRate: 10 };

  // 정액 분할 상환방식을 사용하여 월 상환금액 계산
  const monthlyPayment = calculateMonthlyPayment(evaluationResult.maxLoanAmount, evaluationResult.interestRate, period);

  return {
    ...evaluationResult,
    monthlyPayment,
  };
}

function calculateMonthlyPayment(principal: number, annualInterestRate: number, termInMonths: number): number {
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const totalPayments = termInMonths;
  
  // 정액 분할 상환방식 계산
  const monthlyPrincipalPayment = principal / totalPayments;
  const firstMonthInterest = principal * monthlyInterestRate;
  
  // 첫 달의 상환금액 (원금 + 이자)
  const monthlyPayment = monthlyPrincipalPayment + firstMonthInterest;

  return Math.round(monthlyPayment);
}

