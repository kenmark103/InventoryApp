import { createLazyFileRoute } from '@tanstack/react-router'
import Purchases from '@/features/purchases'


export const Route = createLazyFileRoute('/_authenticated/purchase/')({
  component: Purchases,
})
