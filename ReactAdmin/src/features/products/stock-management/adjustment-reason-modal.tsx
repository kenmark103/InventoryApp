// src/components/adjustment-reason-modal.tsx
import { Fragment, useState } from 'react';
import { Dialog, Transition, Button } from '@headlessui/react';
import type { Product } from '../data/product-schema';

interface AdjustmentReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  adjustment: number;
  onConfirm: (reason: string, notes: string, adjustmentAmount: number) => Promise<void>;
}

export const AdjustmentReasonModal = ({
  open,
  onOpenChange,
  product,
  adjustment,
  onConfirm,
}: AdjustmentReasonModalProps) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [newQuantity, setNewQuantity] = useState(product.quantity.toString());
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    setLoading(true);
    
    const actualAdjustment = adjustment === 0 
      ? parseInt(newQuantity) - product.quantity
      : adjustment;

    await onConfirm(reason, notes, actualAdjustment);
    setLoading(false);
    setReason('');
    setNotes('');
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => onOpenChange(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal content */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
               <Dialog.Title /* ... */>
                  {adjustment === 0
                  ? `Set Quantity for ${product.name}`
                  : `${adjustment > 0 ? 'Add' : 'Remove'} ${Math.abs(adjustment)} from ${product.name}`}
               </Dialog.Title>

                <div className="mt-4 space-y-4">
                {adjustment === 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Quantity
                      </label>
                      <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="e.g. Stocktake correction"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                      placeholder="Any additional context..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    disabled={!reason || loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="mr-2">Processing...</span>
                        <svg
                          className="h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </span>
                    ) : (
                      'Confirm'
                    )}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};