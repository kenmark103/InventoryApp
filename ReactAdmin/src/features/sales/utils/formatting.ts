
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'KES' | 'INR';

export function getCurrencySymbol(currency: CurrencyCode = 'KES'): string {
  const symbols: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh ',
    INR: '₹'
  };
  return symbols[currency];
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'KES',
  decimalScale = 2
): string {
  return `${getCurrencySymbol(currency)}${value.toFixed(decimalScale)}`;
}