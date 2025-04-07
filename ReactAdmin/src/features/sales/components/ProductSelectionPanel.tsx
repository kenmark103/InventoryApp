import { useState } from 'react';
import { useSales } from '../context/sales-context';
import { useProducts } from "@/features/products/context/products-context";
import { useCategories } from "@/features/categories/context/categories-context";
import { ProductCard } from './ProductCard';
import { ProductDetailPanel } from './ProductDetailPanel';
import { XIcon } from "@/components/ui/x-icon";

export function ProductSelectionPanel() {
  const { addItemToSale } = useSales();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.categoryId === selectedCategoryId)
    : products;

  const handleBarcodeScan = (value: string) => {
    if (value.length === 13) {
      const product = products.find(p => p.barcode === value);
      if (product) {
        addItemToSale({ ...product, quantity: 1 });
        setBarcodeInput('');
      }
    }
  };

  if (productsLoading || categoriesLoading) return <div className="p-4">Loading...</div>;
  if (productsError) return <div className="p-4 text-red-500">{productsError}</div>;
  if (categoriesError) return <div className="p-4 text-red-500">{categoriesError}</div>;

  return (
    <div className="h-full flex flex-col border-r dark:border-gray-700">
      {/* Barcode Scanner */}
      <div className="p-4 border-b dark:border-gray-700">
        <input
          type="text"
          value={barcodeInput}
          onChange={(e) => {
            setBarcodeInput(e.target.value);
            handleBarcodeScan(e.target.value);
          }}
          placeholder="Scan barcode..."
          className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b dark:border-gray-700 flex gap-2 overflow-x-auto">
        <button
          key="all"
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-2 rounded-full text-sm ${
            !selectedCategoryId
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategoryId === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => addItemToSale({ ...product, quantity: 1 })}
            onShowDetail={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {/* Product Detail Panel */}
      {selectedProduct && (
        <ProductDetailPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={(product) => {
            addItemToSale({ ...product, quantity: 1 });
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}