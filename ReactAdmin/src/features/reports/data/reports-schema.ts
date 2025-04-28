export interface ProfitLossReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  costOfGoodsSold: number;
  totalExpenses: number;
  expenseByCategory: Record<string, number>;
  revenueByProduct: Record<string, number>;
}

export interface LedgerEntry {
  id: number;
  date: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  activeCustomers: number;
  monthlySales: number;
  totalExpenses: number;
  revenueTrend: number;
  customerTrend: number;
  salesTrend: number;
  expenseTrend: number;
}

// Inventory Report Types
export interface InventoryReportDto {
  generatedAt: string;
  totalInventoryValue: number;
  totalStockItems: number;
  lowStockItems: number;
  items: InventoryItemDto[];
  recentActivity: StockMovementDto[];
}

export interface InventoryItemDto {
  id: number;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  lastStocked: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface StockMovementDto {
  date: string;
  type: 'Purchase' | 'Sale' | 'Adjustment';
  reference: string;
  quantityChange: number;
  newBalance: number;
}