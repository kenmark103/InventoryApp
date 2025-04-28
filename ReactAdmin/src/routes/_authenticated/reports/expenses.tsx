import { createFileRoute } from '@tanstack/react-router'
import ExpensesPage from '@/features/reports/pages/expenses'

export const Route = createFileRoute('/_authenticated/reports/expenses')({
  component: ExpensesPage,
})
