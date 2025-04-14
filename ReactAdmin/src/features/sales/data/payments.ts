import { toast } from 'sonner';

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  MPESA = "MPESA"
}

export interface PaymentDetails {
  method: PaymentMethod;
  transactionId?: string;
  amountTendered: number;
  changeDue: number;
  mpesaPhone?: string;
}

export interface PaymentProcessorOptions {
  signal?: AbortSignal;
}

export type ProcessCardPayment = (
  details: PaymentDetails,
  options?: PaymentProcessorOptions
) => Promise<{ transactionId: string }>;

export type fakeProcessMpesaPayment = (
  phone: string,
  amount: number,
  options?: PaymentProcessorOptions
) => Promise<{ transactionId: string }>;



export const ProcessMpesaPayment: ProcessMpesaPayment = async (
  phone,
  amount,
  options
) => {
  toast.info(`[MockMpesa] Simulating payment for ${phone}, amount=${amount}`);
  await new Promise((res) => setTimeout(res, 500));
  return {
    transactionId: `MOCK-MPESA-${Date.now()}`
  };
};
