import { createLazyFileRoute } from '@tanstack/react-router'
import Sales from '@/features/sales'

export const Route = createLazyFileRoute('/_authenticated/sales/')({
  component: Sales,
})

