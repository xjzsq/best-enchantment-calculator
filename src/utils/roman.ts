const ROMAN_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function toRoman(num: number): string {
  if (num >= 1 && num <= 10) return ROMAN_NUMERALS[num];
  return String(num);
}
