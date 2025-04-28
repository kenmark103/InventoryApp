// app/reports/balance-sheet.tsx
'use client';
import ReportsLayout from '../layout/layout';
import CashFlow from '../components/CashFlow';

export default function CashFlowPage() {
  return (
    <ReportsLayout>
      <CashFlow />
    </ReportsLayout>
  );
}