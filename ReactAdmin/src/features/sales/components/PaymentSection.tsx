// components/sales/PaymentSection.tsx
import { useSales } from '../context/sales-context';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import { PaymentDialog } from './PaymentDialog';
import { useState } from 'react';

export function PaymentSection() {
  const { currentSale } = useSales();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  if (!currentSale) return null;

  return (
    <div className="space-y-4">
      {/* Totals Display */}
      <div className="grid grid-cols-2 gap-4 max-w-md ml-auto">
        <div className="col-span-2 border-b pb-2 mb-2">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal:</span>
            <NumericFormat
              value={currentSale.subtotal}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax:</span>
            <NumericFormat
              value={currentSale.taxAmount}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Discount:</span>
            <NumericFormat
              value={-currentSale.discount}
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
              value={currentSale.total}
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
        className="w-full py-4 text-lg"
        disabled={currentSale.items.length === 0}
      >
        Process Payment
      </Button>

      {/* Payment Dialog */}
      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      />
    </div>
  );
}