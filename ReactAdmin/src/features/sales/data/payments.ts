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

export type ProcessMpesaPayment = (
  phone: string,
  amount: number,
  options?: PaymentProcessorOptions
) => Promise<{ transactionId: string }>;