import { createFileRoute } from '@tanstack/react-router'
import SalesPage from '@/features/reports/pages/sales'

export const Route = createFileRoute('/_authenticated/reports/sales-report')({
  component: SalesPage,
})


