// src/components/stock-management-page.tsx
import React, { useState } from 'react';
import { useProducts } from '../context/products-context';
import { Product } from '../data/product-schema';
import productService from '@/services/productService';

const StockManagementPage = () => {
  const { products, refreshProducts } = useProducts();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setLoadingId(productId);
    setError(null);
    
    try {
      await productService.updateQuantity(productId, newQuantity);
      await refreshProducts();
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Stock Management</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Adjust Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover mr-4"
                          />
                        )}
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                          disabled={loadingId === product.id}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <span className="sr-only">Decrease</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>

                        <input
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                          disabled={loadingId === product.id}
                          className="w-20 px-3 py-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />

                        <button
                          onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                          disabled={loadingId === product.id}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <span className="sr-only">Increase</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagementPage;