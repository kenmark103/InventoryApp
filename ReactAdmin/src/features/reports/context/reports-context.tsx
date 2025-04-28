// features/reports/context/reports-context.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import reportService from '@/services/reportService';
import accountingService from '@/services/accountingService';
import { DashboardMetrics, LedgerEntry, ProfitLossReport } from '../data/reports-schema';


type ReportContextType = {
  fetchLedger: (start?: Date, end?: Date) => Promise<any[]>;
  fetchTrialBalance: (asOf?: Date) => Promise<any[]>;
  fetchProfitLoss: (start: Date, end: Date) => Promise<any>;
  fetchCashFlow: (start: Date, end: Date) => Promise<any>;
  fetchBalanceSheet: () => Promise<any>;
  fetchSales: (start?: Date, end?: Date) => Promise<SaleDto[]>;
  fetchExpenses: (start?: Date, end?: Date) => Promise<ExpenseDto[]>;
  fetchRecentSales: (limit?: number) => Promise<SaleDto[]>;
  fetchDashboardMetrics: () => Promise<DashboardMetrics>;
  exportReport: (
    reportType: string,
    format: 'pdf' | 'excel',
    start?: Date,
    end?: Date
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrap = async <T,>(
    fn: () => Promise<T>
  ): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        fetchProfitLoss: (s, e) =>
          wrap(() =>
            reportService.getProfitLossReport(
              s.toISOString(),
              e.toISOString()
            )
          ),
        fetchLedger: (s, e) =>
          wrap(() =>
            accountingService.getGeneralLedger(
              s?.toISOString(),
              e?.toISOString()
            )
          ),
        fetchTrialBalance: (asOf) =>
          wrap(() =>
            accountingService.getTrialBalance(asOf?.toISOString())
          ),
        fetchCashFlow: (s, e) =>
          wrap(() =>
            reportService.getCashFlowReport(s.toISOString(), e.toISOString())
          ),
        fetchBalanceSheet: () => wrap(() => reportService.getBalanceSheet()),
        fetchSales: (s, e) =>
          wrap(() =>
            reportService.getSalesReport(
              s?.toISOString(),
              e?.toISOString()
            )
          ),
          fetchRecentSales: (limit = 5) =>
            wrap(() => reportService.getRecentSales(limit)),
        fetchExpenses: (s, e) =>
          wrap(() =>
            reportService.getExpensesReport(
              s?.toISOString(),
              e?.toISOString()
            )
          ),
        fetchDashboardMetrics: () => wrap(() => reportService.getDashboardMetrics()),
        fetchInventoryReport: (options?: {  includeInactive?: boolean; lowStockThreshold?: number}) => 
            wrap(() => 
              reportService.getInventoryReport(
                options?.includeInactive,
                options?.lowStockThreshold
              )
            ),
        exportReport: (type, fmt, s, e) =>
          wrap(() =>
            reportService.exportReport(
              fmt,
              s?.toISOString(),
              e?.toISOString(),
              type
            )
          ),
        loading,
        error,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = (): ReportContextType => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error('useReports must be inside ReportProvider');
  return ctx;
};
