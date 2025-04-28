import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const NAIROBI_TZ = 'Africa/Nairobi';

export function formatDate(
  dateString: string,
  pattern = 'dd MMM yyyy HH:mm'
): string {
  return formatInTimeZone(dateString, NAIROBI_TZ, pattern);
}

type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP' | 'ZAR';

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  KES: 'KSh',
  USD: '$',
  EUR: '€',
  GBP: '£',
  ZAR: 'R'
};

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'KES',
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits,
    currencyDisplay: 'symbol'
  })
  .format(amount)
  .replace(/KES/, CURRENCY_SYMBOLS[currency]);
}
