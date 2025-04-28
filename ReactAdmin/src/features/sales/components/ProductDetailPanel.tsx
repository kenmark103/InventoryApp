import { XIcon } from "@/components/ui/x-icon";
import { Product } from "@/features/products/data/products-schema";
import { useCategories } from '@/features/categories/context/categories-context';
import { getImageUrl } from '@/utils/apiHelpers';
import { useState } from 'react';

interface ProductDetailPanelProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void; 
}

export function ProductDetailPanel({ product, onClose, onAdd }: ProductDetailPanelProps) {
  // guard categories to always be an array
  const { categories = [] } = useCategories() ?? {};
  const productCategory = categories.find(c => c.id === product.categoryId);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(product, quantity); 
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 z-[60]">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold dark:text-gray-100">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label="Close product details"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="h-48 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">SKU:</span>
            <span className="font-medium dark:text-gray-100">{product.sku}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Category:</span>
            <span className="font-medium dark:text-gray-100">
              {productCategory?.name || 'Uncategorized'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Stock:</span>
            <span className={`${
              product.quantity > 10 
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            } font-medium`}
            >
              {product.quantity} units
            </span>
          </div>
        </div>

        {/* Quantity and Add Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              -
            </button>
            <span className="w-12 text-center bg-white dark:bg-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition ease-in-out duration-150"
          >
            Add ({quantity})
          </button>
        </div>
      </div>
    </div>
  );
}
