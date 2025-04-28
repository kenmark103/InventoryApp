import { createFileRoute } from '@tanstack/react-router'
import CashFlowPage from '@/features/reports/pages/cash-flow'

export const Route = createFileRoute('/_authenticated/reports/cash-flow')({
  component: CashFlowPage,
})

