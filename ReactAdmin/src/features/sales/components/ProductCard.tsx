// components/ProductCard.tsx
import { PlusIcon } from '@/components/ui/plus-icon';
import { useState } from 'react';
import { Product } from "@/features/products/data/products-schema";
import { useCategories } from '@/features/categories/context/categories-context';
import { getImageUrl } from '@/utils/apiHelpers';
import React from 'react';

interface ProductCardProps {
  product: Product;
  onAdd: (productId: number) => void;
  onShowDetail: (productId: number) => void;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  onAdd,
  onShowDetail
}: ProductCardProps) {

  const { categories = [] } = useCategories() ?? {};
  const productCategory = categories.find(c => c.id === product.categoryId);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={(e) => {
      if (!(e.target as HTMLElement).closest('button')) {
        onShowDetail(product.id);
      }
    }}
    >
      {/* Image & Stock Wrapper */}
      <div className="relative aspect-square mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600" />
        )}
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        {/* Stock Indicator inside image container */}
        <div
          className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs ${
            product.quantity > 10
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {product.quantity} in stock
        </div>
        {/* Add Button inside image container */}
        <button
          onClick={(e) => {  e.stopPropagation(); onAdd(product.id); }}
          className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
          aria-label="Add to sale"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="relative flex flex-col">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {productCategory?.name || 'Uncategorized'}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
          ${product.sellingPrice.toFixed(2)}
        </p>
      </div>
    </div>

  )
  }); 
