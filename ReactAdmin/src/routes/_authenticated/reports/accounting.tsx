import { createFileRoute } from '@tanstack/react-router'
import AccountingPage from '@/features/reports/pages/accounting'

export const Route = createFileRoute('/_authenticated/reports/accounting')({
  component: AccountingPage,
})
