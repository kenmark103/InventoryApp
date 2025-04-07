// components/sales/ReceiptPrint.tsx
import { useReactToPrint } from 'react-to-print';
import { useSales } from '../context/sales-context';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

export function ReceiptPrint() {
  const { currentSale, paymentDetails } = useSales();
  const componentRef = useRef(null);
  const hasPrinted = useRef(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => (hasPrinted.current = true),
  });

useEffect(() => {
  if (currentSale?.status === 'COMPLETED' && !hasPrinted.current) {
    handlePrint();
    hasPrinted.current = true;
  }
}, [currentSale?.status, handlePrint]);

  if (!currentSale || !paymentDetails) return null;

  return (
    <div className="hidden">
      <div ref={componentRef} className="p-6 text-sm font-mono">
        {/* Receipt Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Your Business Name</h1>
          <p className="text-xs">123 Main Street, City</p>
          <p className="text-xs">Phone: (555) 123-4567</p>
        </div>

        {/* Sale Info */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{format(new Date(currentSale.saleDate), 'yyyy-MM-dd HH:mm')}</span>
          </div>
          <div className="flex justify-between">
            <span>Invoice #:</span>
            <span>{currentSale.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Cashier:</span>
            <span>{currentSale.processedBy}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="border-y py-2 my-2">
          {currentSale.items.map((item) => (
            <div key={item.productId} className="flex justify-between mb-1">
              <div>
                <span className="font-medium">{item.quantity}x </span>
                {item.productName}
              </div>
              <div>
                ${(item.unitPrice * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${currentSale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${currentSale.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-${currentSale.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${currentSale.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span>{paymentDetails.method}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Tendered:</span>
            <span>${paymentDetails.amountTendered.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change Due:</span>
            <span>${paymentDetails.changeDue.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs">
          <p>Thank you for your business!</p>
          <p>Returns accepted within 14 days with receipt</p>
        </div>
      </div>

      {/* Print Trigger */}
      <button 
        onClick={handlePrint}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        Reprint Receipt
      </button>
    </div>
  );
}