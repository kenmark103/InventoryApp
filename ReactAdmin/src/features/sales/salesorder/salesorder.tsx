// app/sales-orders/components/sales-order.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Printer, Download, Share2, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const dummySale: SaleResponseDto = {
  id: 1,
  invoiceNumber: "INV-2024-001",
  saleDate: "2024-03-15T10:30:00Z",
  status: "PAID",
  paymentMethod: "MPESA",
  subtotal: 24500,
  taxAmount: 3920,
  discount: 1000,
  total: 27420,
  customerName: "Nairobi Tech Hub",
  processedBy: "sales@example.com",
  items: [
    {
      productName: "Wireless Keyboard",
      quantity: 5,
      unitPrice: 3500,
      taxRate: 0.16,
      lineTotal: 20300
    },
    {
      productName: "Gaming Mouse",
      quantity: 3,
      unitPrice: 2500,
      taxRate: 0.16,
      lineTotal: 8700
    }
  ]
};

export function SalesOrder() {

    const navigate = useNavigate();
    
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/sales-orders' })}
          className="gap-2 mb-6 text-sm text-gray-600 px-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" /> 
          Back to Orders
        </Button>        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Invoice #{dummySale.invoiceNumber}</h1>
            <p className="text-gray-500">
              {format(new Date(dummySale.saleDate), 'PPpp')}
            </p>
          </div>
          <Badge 
            variant={dummySale.status === 'PAID' ? 'default' : 'destructive'}
            className="capitalize"
          >
            {dummySale.status.toLowerCase()}
          </Badge>
        </div>
      </div>

      {/* Company & Customer Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">From</h3>
          <p className="text-gray-600">
            Your Business Name<br />
            123 Business Street<br />
            Nairobi, Kenya<br />
            VAT: KE123456789
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <p className="text-gray-600">
            {dummySale.customerName}<br />
            456 Client Avenue<br />
            Nairobi, Kenya<br />
            Phone: +254 712 345 678
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Item</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Qty</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Tax</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {dummySale.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">{item.productName}</td>
                  <td className="px-4 py-3 text-right">
                    KES {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    {(item.taxRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    KES {item.lineTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div></div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>KES {dummySale.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({((dummySale.taxAmount / dummySale.subtotal) * 100).toFixed(0)}%):</span>
            <span>KES {dummySale.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>- KES {dummySale.discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total:</span>
            <span>KES {dummySale.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Payment Information</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <p>Method: {dummySale.paymentMethod}</p>
            <p>Transaction Date: {format(new Date(dummySale.saleDate), 'PPpp')}</p>
          </div>
          <div>
            <p>Transaction ID: MPESA123456</p>
            <p>Processed by: {dummySale.processedBy}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 border-t pt-6">
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> PDF
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </div>

      {/* Footer Notes */}
      <div className="mt-8 pt-6 border-t text-sm text-gray-500">
        <p>Notes: Thank you for your business!</p>
        <p>Terms: Payment due within 30 days</p>
      </div>
    </div>
  );
}