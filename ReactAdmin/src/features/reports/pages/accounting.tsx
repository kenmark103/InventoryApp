// app/reports/accounting.tsx
'use client';
import ReportsLayout from '../layout/layout';
import AccountingReports from '../components/AccountingReports';

export default function AccountingPage() {
  return (
    <ReportsLayout>
      <AccountingReports />
    </ReportsLayout>
  );
}
