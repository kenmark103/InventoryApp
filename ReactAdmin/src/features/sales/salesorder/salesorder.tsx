// app/sales-orders/components/sales-order.tsx
'use client';
import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Printer, Download, Share2, ArrowLeft, Wallet, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { SaleResponseDto } from '../data/sales-schema';
import saleService from '@/services/saleService';

export function SalesOrder() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  
  const { data: sale, isLoading, isError } = useQuery({
  queryKey: ['sales', id, 'receipt'],
  queryFn: async () => {
    const data = await saleService.getReceipt(Number(id));
    return {
      ...data,
      saleDate: new Date(data.saleDate),
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : null
    };
  }
});

  useEffect(() => {
    if (sale) {
      console.log('Sale Data:', {
        subtotal: sale.subtotal,
        taxAmount: sale.taxAmount,
        discount: sale.discount,
        total: sale.total,
        items: sale.items,
        rawData: sale
      });
    }
  }, [sale]);

  if (isLoading) return <div className="text-center p-8">Loading sale details...</div>;
  if (!sale) return null;
  if (isError) return (
  <div className="text-center p-8">
    <div className="text-red-600 mb-4">Error loading receipt</div>
    <Button 
      variant="outline"
      onClick={() => navigate({ to: '/sales/salesorders' })}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Sales Orders
    </Button>
  </div>
);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate({ to: '/sales/salesorders' })}
          className="gap-2 mb-6 text-sm text-gray-600 px-0 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4" /> 
          Back to Orders
        </Button>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Invoice #{sale.invoiceNumber}</h1>
            <p className="text-gray-500">
              {format(new Date(sale.saleDate), 'PPpp')}
            </p>
          </div>
          <Badge 
            variant={sale.status === 'PAID' ? 'default' : 'destructive'}
            className="capitalize"
          >
            {sale.status.toLowerCase()}
          </Badge>
        </div>
      </div>

      {/* Company & Customer Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">From</h3>
          <p className="text-gray-600">
            Inventory Sales System<br />
            123 Business Street<br />
            Nairobi, Kenya<br />
            VAT: KE123456789
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <p className="text-gray-600">
            {sale.customerName}<br />
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
              {sale.items.map((item, index) => (
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
            <span>
              KES {(sale.subtotal || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({
              (sale.taxAmount && sale.subtotal ? 
                ((sale.taxAmount / sale.subtotal) * 100).toFixed(0) : 
                '0'
              )}%):
            </span>
            <span>KES {(sale.taxAmount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>- KES {(sale.discount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total:</span>
            <span>KES {(sale.total || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-8">
        <h3 className="font-semibold mb-2">Payment Information</h3>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <p>Method: {sale.paymentInfo.paymentMethod}</p>
            <p>Amount Tendered: KES {sale.paymentInfo.amountTendered.toLocaleString()}</p>
            <p>Change Due: KES {sale.paymentInfo.changeDue.toLocaleString()}</p>
          </div>
          <div>
            <p>Transaction ID: {sale.paymentInfo.transactionId}</p>
             <p>Payment Date: {
                sale.paymentInfo.paymentDate instanceof Date && !isNaN(sale.paymentInfo.paymentDate.getTime()) 
                  ? format(sale.paymentInfo.paymentDate, 'PPpp') 
                  : 'N/A'
              }</p>
            <p>Receipt Number: {sale.receiptNumber}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 border-t pt-6">
        {sale.status === 'PAID' && (
          <Button 
            variant="outline"
            onClick={() => navigate({ 
              to: '/sales-orders/$id/returns',
              params: { id }
            })}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Process Return
          </Button>
        )}
        
        {!['PAID', 'COMPLETED'].includes(sale.status) && (
          <Button 
            variant="default"
            onClick={() => navigate({ 
              to: '/sales-orders/$id/receive-payment',
              params: { id }
            })}
          >
            <Wallet className="mr-2 h-4 w-4" /> Receive Payment
          </Button>
        )}

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
        <p>Notes: {sale.notes || 'Thank you for your business!'}</p>
        <p>Terms: {sale.terms || 'Payment due within 30 days'}</p>
      </div>
    </div>
  );
}