// app/reports/balance-sheet.tsx
'use client';
import ReportsLayout from '../layout/layout';
import InventoryReport from '../components/InventoryReport';

export default function InventoryReportsPage() {
  return (
    <ReportsLayout>
      <InventoryReport />
    </ReportsLayout>
  );
}