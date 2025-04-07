import { createLazyFileRoute } from '@tanstack/react-router'
import Expenses from '@/features/expenses'

export const Route = createLazyFileRoute('/_authenticated/expenses/')({
  component: Expenses,
})
