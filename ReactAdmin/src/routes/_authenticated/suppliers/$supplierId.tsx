import { createFileRoute } from '@tanstack/react-router'
import SupplierDetail from '@/features/suppliers/components/supplierDetail'

export const Route = createFileRoute('/_authenticated/suppliers/$supplierId')({
  component: SupplierDetail,
  validateSearch: (search: Record<string, unknown>) => ({
    supplierId: search.supplierId as string,
  }),
})
