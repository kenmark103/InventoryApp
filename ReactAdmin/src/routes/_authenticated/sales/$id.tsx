import { createFileRoute } from '@tanstack/react-router'
import SalesOrderPage from '@/features/sales/salesorder/page'

export const Route = createFileRoute('/_authenticated/sales/$id')({
  component: SalesOrderPage,
})

