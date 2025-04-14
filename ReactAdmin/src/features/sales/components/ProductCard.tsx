// components/ProductCard.tsx
import { PlusIcon } from '@/components/ui/plus-icon';
import { Product } from "@/features/products/data/product-schema";
import { useCategories } from '@/features/categories/context/categories-context';
import { getImageUrl } from '@/utils/apiHelpers';
import { DragHandleIcon } from '@/components/ui/drag-handle-icon'; // hypothetical icon

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
  onShowDetail: () => void;
}

export function ProductCard({ product, onAdd, onShowDetail }: ProductCardProps) {
  // guard categories to always be an array
  const { categories = [] } = useCategories() ?? {};
  const productCategory = categories.find(c => c.id === product.categoryId);

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onShowDetail}
    >
      {/* Stock Indicator */}
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${
        product.stock > 10 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      }`}>
        {product.stock} in stock
      </div>

      {/* Drag Handle */}
      <div
        className="absolute top-2 left-2 p-1"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('product', JSON.stringify(product));
        }}
      >
        <DragHandleIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </div>

      {/* Product Image */}
      <div className="aspect-square mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {productCategory?.name || 'Uncategorized'}
      </p>
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
        ${product.sellingPrice.toFixed(2)}
      </p>

      {/* Quick Add Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        className="absolute bottom-14 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
        aria-label="Add to sale"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
