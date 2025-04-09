import { 
  PaymentMethod, 
  PaymentDetails,
  ProcessCardPayment,
  ProcessMpesaPayment
} from './payments'


export interface SaleItem {
  id: number;
  productId: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  taxRate: number;
  discount: number;
  imageUrl?: string;
  stock: number;
}

export interface Sale {
  id: number;
  invoiceNumber: string;
  saleDate: Date;
  dueDate?: Date;
  status: 'DRAFT' | 'COMPLETED' | 'HOLD' | 'PAID' | 'CANCELLED';
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

export interface SaleCreateDto {
  customerId: number;
  notes?: string;
  dueDate?: Date;
  discount: number;
  items: SaleItemDto[];
  paymentDetails?: PaymentDetails;
  paymentMethod?: PaymentMethod; 
}

export interface SaleCreateDto {
  customerId: number;
  notes?: string;
  dueDate?: Date;
  discount: number;
  items: SaleItemDto[];
  paymentMethod?: PaymentMethod;
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
  customerName: string;
  processedBy: string;
  items: SaleItemResponseDto[];
}

export interface SaleItemResponseDto {
  productName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}


export interface Sale extends SaleResponseDto {
  paymentDetails?: PaymentDetails;
  status: 'DRAFT' | 'COMPLETED' | 'CANCELLED';
}



export enum SaleStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  HOLD = "HOLD",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

