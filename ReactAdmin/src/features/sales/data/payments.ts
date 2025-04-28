import { toast } from 'sonner';

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  MPESA = "MPESA"
}

interface BasePaymentDetails {
  method: PaymentMethod;
  amountTendered: number;
  changeDue: number;
}

export interface CashPaymentDetails extends BasePaymentDetails {
  method: PaymentMethod.CASH;
}

export interface CardPaymentDetails extends BasePaymentDetails {
  method: PaymentMethod.CREDIT_CARD;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  processor: 'visa' | 'mastercard' | 'amex';
}

export interface MpesaPaymentDetails extends BasePaymentDetails {
  method: PaymentMethod.MPESA;
  mpesaPhone: string;
}

export type PaymentDetails = CashPaymentDetails | CardPaymentDetails | MpesaPaymentDetails;

// Mock Processors
export const ProcessCardPayment = async (details: CardPaymentDetails) => {
  toast.info(`[Mock] Processing ${details.processor} card ${details.cardNumber.slice(-4)}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { transactionId: `MOCK-CARD-${Date.now()}` };
};

export const ProcessMpesaPayment = async (phone: string, amount: number) => {
  toast.info(`[Mock] M-Pesa payment to ${phone} for $${amount}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { transactionId: `MOCK-MPESA-${Date.now()}` };
};