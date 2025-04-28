import { createFileRoute } from '@tanstack/react-router';
import { AddProduct } from '@/features/products/components/products-add';

export const Route = createFileRoute('/_authenticated/products/add')({
  component: AddProductPage,
})

function AddProductPage() {
  return <AddProduct />
}
