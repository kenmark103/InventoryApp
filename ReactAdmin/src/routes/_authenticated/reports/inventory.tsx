import { createFileRoute } from '@tanstack/react-router'
import InventoryReportsPage from '@/features/reports/pages/inventory'

export const Route = createFileRoute('/_authenticated/reports/inventory')({
  component: InventoryReportsPage,
})
