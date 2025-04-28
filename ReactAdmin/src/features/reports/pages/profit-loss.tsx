
// app/reports/profit-loss.tsx
'use client';
import ReportsLayout from '../layout/layout';
import ProfitLossReport from '../components/ProfitLossReport';

export default function ProfitLossPage() {
  return (
    <ReportsLayout>
      <ProfitLossReport />
    </ReportsLayout>
  );
}