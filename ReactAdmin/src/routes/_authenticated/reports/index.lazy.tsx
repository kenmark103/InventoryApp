import { createLazyFileRoute } from '@tanstack/react-router'
import ReportsPage from '@/features/reports'

export const Route = createLazyFileRoute('/_authenticated/reports/')({
  component: ReportsPage,
})

