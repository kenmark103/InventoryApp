/* eslint-disable @typescript-eslint/no-empty-object-type */
import { 
  PaymentMethod, 
  PaymentDetails,
} from './payments'


export interface BaseSaleItem {
  productId: number;
  quantity: number;
  price: number;
  discount?: number;
}

export interface SaleItem extends BaseSaleItem {

  id?: number;  
  name: string;
  sku: string;
  taxRate: number;
  imageUrl?: string;
  stock: number;
  costPrice: number;
  barcode?: string; 
}


export interface Sale {
  id?: number;
  status: SaleStatus;
  invoiceNumber: string;
  saleDate: Date;
  dueDate?: Date;
  paymentMethod: PaymentMethod;
  notes?: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  customerId: number;
  customerName?: string;
  userId: number;
  items: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
  paymentDetails: PaymentDetails | null;
  totals: {
    subTotal: number;
    totalTax: number;
    grandTotal: number;
    totalCost: number;
  };
}

export interface SaleItemCreateDto extends BaseSaleItem {

}

export interface SaleItemResponseDto extends BaseSaleItem {

  productName: string;
  total: number;
  taxAmount: number;
  barcode?: string;
}

export interface SaleCreateDto {
  customerId: number;
  notes?: string;
  dueDate?: Date;
  discount: number;
  items: SaleItemCreateDto[];
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails | null;
}
export interface SaleResponseDto {
  id: number;
  invoiceNumber: string;
  saleDate: Date;
  status: string;
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  customerName?: string;
  processedBy: string;
  items: SaleItemResponseDto[];
}

export interface SaleItemResponseDto {
  productName: string;
  quantity: number;
  price: number;
  taxRate: number;
  total: number;
}


export interface SaleReceiptDto extends SaleResponseDto {
  receiptNumber: string;
  paymentInfo: {
    paymentMethod: PaymentMethod;
    transactionId: string;
    amountTendered: number;
    changeDue: number;
    paymentDate: Date;
  };
  terms?: string;
  notes?: string;
}

export enum SaleStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  HOLD = "HOLD",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

