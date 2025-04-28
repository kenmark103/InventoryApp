
// components/QuantityStepper.tsx
import { SaleItem } from "../data/sales-schema";
import { useCallback } from 'react';
import { useSales } from '../context/sales-context';
import { useProducts } from '@/features/products/context/products-context';

interface QuantityStepperProps {
  item: SaleItem;
}

export function QuantityStepper({ item }: QuantityStepperProps) {
  const { updateItem } = useSales();
  const { products } = useProducts();

  const currentProduct = products.find(p => p.id === item.productId);
  const currentStock = currentProduct?.quantity ?? item.stock;

  const handleChange = useCallback((newQuantity: number) => {
    const validated = Math.min(
      Math.max(newQuantity, 1),
      currentStock 
    );
    
    updateItem(item.productId, { quantity: validated });
  }, [item.productId, currentStock, updateItem]);
  return (
    <div className="flex items-center gap-2 border rounded-lg p-1">
      <button
        onClick={() => handleChange(item.quantity - 1)}
        className="px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        disabled={item.quantity <= 1}
      >
        -
      </button>
      <span className="w-8 text-center">{item.quantity}</span>
      <button
        onClick={() => handleChange(item.quantity + 1)}
        className="px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        disabled={item.quantity >= item.stock}
      >
        +
      </button>
    </div>
  );
}
