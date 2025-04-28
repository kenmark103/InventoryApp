// app/reports/balance-sheet.tsx
'use client';
import ReportsLayout from '../layout/layout';
import BalanceSheet from '../components/BalanceSheet';

export default function BalanceSheetPage() {
  return (
    <ReportsLayout>
      <BalanceSheet />
    </ReportsLayout>
  );
}