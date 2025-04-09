import { createFileRoute } from '@tanstack/react-router'
import  SalesOrders from '@/features/sales/salesorder/index'

export const Route = createFileRoute('/_authenticated/sales/salesorders')({
  component: SalesOrders,
})
