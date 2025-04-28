import { createLazyFileRoute } from '@tanstack/react-router'
import ApprovePage from '@/features/expenses/approve-expenses'

export const Route = createLazyFileRoute('/_authenticated/expenses/approve/')({
  component: ApprovePage,
})

