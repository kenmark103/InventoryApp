import { createFileRoute } from '@tanstack/react-router'
import BalanceSheetPage from '@/features/reports/pages/balance-sheet'

export const Route = createFileRoute('/_authenticated/reports/balance-sheet')({
  component: BalanceSheetPage,
})

