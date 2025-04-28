
export interface StockAdjustmentCreateDto {
  adjustmentAmount: number;
  reason: string;
  notes?: string;
}

export interface StockAdjustmentResponseDto {
  id: number;
  productId: number;
  productName: string;
  adjustmentAmount: number;
  reason: string;
  notes?: string;
  adjustedAt: string;     
  adjustedBy: string;
}
