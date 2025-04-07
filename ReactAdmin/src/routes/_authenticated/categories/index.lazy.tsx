import { createLazyFileRoute } from '@tanstack/react-router'
import Categories from '@/features/categories'

export const Route = createLazyFileRoute('/_authenticated/categories/')({
  component: Categories,
})
