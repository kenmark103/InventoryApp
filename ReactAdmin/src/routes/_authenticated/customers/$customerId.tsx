import { createFileRoute } from '@tanstack/react-router'
import CustomerDetail from '@/features/customers/components/customerDetail'

export const Route = createFileRoute('/_authenticated/customers/$customerId')({
  component: CustomerDetail,
  validateSearch: (search: Record<string, unknown>) => ({
    customerId: search.customerId as string,
  }),
})
