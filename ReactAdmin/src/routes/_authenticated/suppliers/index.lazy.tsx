import { createLazyFileRoute } from '@tanstack/react-router'
import Suppliers from '@/features/suppliers'

export const Route = createLazyFileRoute('/_authenticated/suppliers/')({
  component: Suppliers,
})
