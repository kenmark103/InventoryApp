interface Sale {
  items: Array<{
    id: number;
    name: string;
    sku: string;
    price: number;
    costPrice: number;
    taxRate: number;
    quantity: number;
    imageUrl?: string;
    stock: number;
    barcode?: string;
  }>;
  status: 'DRAFT' | 'COMPLETED' | 'HOLD';
  customerId: number | null;
  subtotal: number;
  taxAmount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  paymentDetails: PaymentDetails | null;
  totals: {
    subTotal: number;
    totalTax: number;
    grandTotal: number;
    totalCost: number;
  };
  // ... other fields
}