// src/components/stock-management-page.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, MinusIcon, PencilIcon } from 'lucide-react';
import { useProducts } from '../context/products-context';
import { Product } from '../data/product-schema';
import productService from '@/services/productService';
import { getImageUrl } from '@/utils/apiHelpers';
import { AdjustmentReasonModal } from './adjustment-reason-modal';
import { StockAdjustmentHistory } from './stock-adjustment-history';
import { Dialog, Transition } from '@headlessui/react';

const StockManagementPage: React.FC = () => {

  const [tempQuantities, setTempQuantities] = useState<Record<number, number>>({});
  const { products, refreshProducts } = useProducts();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);


   useEffect(() => {
    const initial: Record<number, number> = {};
    products.forEach(p => { initial[p.id] = p.quantity; });
    setTempQuantities(initial);
  }, [products]);

  // Full implementation of onConfirm
  const handleAdjustmentConfirm = async (
    reason: string, 
    notes: string, 
    actualAdjustment: number
  ) => {
    if (!selectedProduct) return;
    
    setLoadingId(selectedProduct.id);
    try {
      await productService.adjustStock(selectedProduct.id, {
        adjustmentAmount: actualAdjustment,
        reason,
        notes,
      });
      await refreshProducts();
    } catch (err) {
      console.error('Adjustment failed:', err);
      setError('Failed to save adjustment. Please try again.');
    } finally {
      setLoadingId(null);
      setShowAdjustModal(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update your stock</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center">
              {/* error icon omitted for brevity */}
              <span>{error}</span>
            </div>
          )}

          {/* Products table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Current Stock</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Adjust Quantity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <img
                            src={getImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-center text-gray-600 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {product.quantity}
                        {loadingId === product.id && (
                          <svg className="animate-spin h-4 w-4 ml-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAdjustmentAmount(-1);
                            setShowAdjustModal(true);
                          }}
                          disabled={product.quantity === 0}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>

                        <span className="w-12 text-center font-medium">{product.quantity}</span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAdjustmentAmount(1);
                            setShowAdjustModal(true);
                          }}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAdjustmentAmount(0);
                            setShowAdjustModal(true);
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* History section */}
          {selectedProduct && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Adjustments</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistoryModal(true)}
                >
                  View Full History
                </Button>
              </div>
              <StockAdjustmentHistory productId={selectedProduct.id} />
            </div>
          )}

          {/* Adjustment Modal */}
          {selectedProduct && (
            <AdjustmentReasonModal
              open={showAdjustModal}
              onOpenChange={setShowAdjustModal}
              product={selectedProduct}
              adjustment={adjustmentAmount}
              onConfirm={handleAdjustmentConfirm}
            />
          )}

          {/* Full History Modal */}
          <Dialog 
            open={showHistoryModal} 
            onClose={() => setShowHistoryModal(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Full Adjustment History {selectedProduct && `for ${selectedProduct.name}`}
                </Dialog.Title>
                {selectedProduct && (
                  <StockAdjustmentHistory 
                    productId={selectedProduct.id} 
                    key={selectedProduct.id}
                  />
                )}
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default StockManagementPage;
