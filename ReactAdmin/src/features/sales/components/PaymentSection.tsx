// components/sales/PaymentSection.tsx
import { useSales } from '../context/sales-context';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import { PaymentDialog } from './PaymentDialog';
import { useState, HTMLAttributes } from 'react';

interface PaymentSectionProps extends HTMLAttributes<HTMLDivElement> {}

export function PaymentSection({ className = '', ...props }: PaymentSectionProps) {
  const { currentSale } = useSales();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const getSaleValue = (key: keyof typeof currentSale) =>
    currentSale?.[key] || 0;

  const itemsCount = currentSale?.items?.length || 0;

  return (
    <div
      {...props}
      className={`space-y-6 ${className} flex-shrink-0`}
    >
      {/* Totals Display */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="col-span-2 border-b pb-2 mb-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <NumericFormat
              value={getSaleValue('subtotal')}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-medium">Tax:</span>
            <NumericFormat
              value={getSaleValue('taxAmount')}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-medium">Discount:</span>
            <NumericFormat
              value={-(getSaleValue('discount'))}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </div>
        </div>

        <div className="col-span-2">
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <NumericFormat
              value={getSaleValue('total')}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </div>
        </div>
      </div>

      {/* Payment Action */}
      <Button
        onClick={() => setIsPaymentDialogOpen(true)}
        className="w-full py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        disabled={itemsCount === 0}
      >
        {itemsCount > 0 ? 'Process Payment' : 'Add Items First'}
      </Button>

      {/* Payment Dialog */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      />
    </div>
  );
}
