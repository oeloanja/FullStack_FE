export const formatNumber = (value: string | number): string => {
  // 문자열로 변환
  const stringValue = typeof value === 'number' ? value.toString() : value;
  // 숫자가 아닌 문자 제거
  const numericValue = stringValue.replace(/[^\d]/g, '');
  // 천 단위로 쉼표 추가
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const parseNumber = (value: string): number => {
  // 쉼표 제거 후 숫자로 변환
  return parseInt(value.replace(/,/g, ''), 10);
};

