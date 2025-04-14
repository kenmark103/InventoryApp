// components/ProductDetailPanel.tsx
import { XIcon } from "@/components/ui/x-icon";
import { Product } from "@/features/products/data/product-schema";
import { useCategories } from '@/features/categories/context/categories-context';
import { getImageUrl } from '@/utils/apiHelpers';

interface ProductDetailPanelProps {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export function ProductDetailPanel({ product, onClose, onAdd }: ProductDetailPanelProps) {
  // guard categories to always be an array
  const { categories = [] } = useCategories() ?? {};
  const productCategory = categories.find(c => c.id === product.categoryId);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold dark:text-gray-100">
            {product.name}
          </h2>
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

        <div className="space-y-3">
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
            <span className={`font-medium ${
              product.stock > 10 
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {product.stock} units
            </span>
          </div>

          {/* Add more product fields here as needed */}
        </div>

        <button
          onClick={() => onAdd(product)}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg transition-colors duration-200"
        >
          Add to Sale
        </button>
      </div>
    </div>
  );
}
