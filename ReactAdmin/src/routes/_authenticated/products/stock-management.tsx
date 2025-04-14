import { createFileRoute } from '@tanstack/react-router'
import StockManagementPage from '@/features/products/stock-management/index'

export const Route = createFileRoute(
  '/_authenticated/products/stock-management',
)({
  component: StockManagementPage,
})

