"use server"

type CreditEvaluationResult = {
  target: 0 | 1 | 2;
  maxLoanAmount: number;
  interestRate: number;
};

export async function getLoanConditions(
  period: number,
  target: 0 | 1 | 2
): Promise<CreditEvaluationResult & { monthlyPayment: number }> {
  let evaluationResult: CreditEvaluationResult;

  // target 값에 따라 대출 조건 설정
  if (target === 1) {
    evaluationResult = { 
      target: 1, 
      maxLoanAmount: 3000000, 
      interestRate: 15 
    };
  } else {
    evaluationResult = { 
      target: 0, 
      maxLoanAmount: 5000000, 
      interestRate: 10 
    };
  }

  // 정액 분할 상환방식을 사용하여 월 상환금액 계산
  const monthlyPayment = calculateMonthlyPayment(
    evaluationResult.maxLoanAmount,
    evaluationResult.interestRate,
    period
  );

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