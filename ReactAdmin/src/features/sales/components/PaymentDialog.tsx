import React, { useState } from 'react';
import { useSales } from '../context/sales-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NumericFormat } from 'react-number-format';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { PaymentMethod, PaymentDetails } from '../data/payments';


export function PaymentDialog({ open, onOpenChange }) {
  const { currentSale, completeSale, isProcessingPayment, paymentError } = useSales();
  const totalDue = currentSale?.total || 0;
  
  const [paymentState, setPaymentState] = useState<PaymentDetails>({
    method: PaymentMethod.CASH,
    amountTendered: totalDue, // Initialize with total due
    changeDue: 0,
    mpesaPhone: ''
  });

  const handleSubmit = async () => {
    if (paymentState.method === PaymentMethod.MPESA && !paymentState.mpesaPhone) {
      setPaymentError('MPESA phone number required');
      return;
    }

    await completeSale(paymentState);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {paymentError && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {paymentError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 p-4 bg-gray-50 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Due:</span>
                <NumericFormat
                  value={totalDue}
                  displayType="text"
                  prefix="Ksh "
                  thousandSeparator
                  decimalScale={2}
                  className="text-xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentState.method}
                onValueChange={v => setPaymentState(p => ({
                  ...p,
                  method: v as PaymentMethod
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                  <SelectItem value={PaymentMethod.CREDIT_CARD}>Credit Card</SelectItem>
                  <SelectItem value={PaymentMethod.MPESA}>M-PESA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* MPESA Phone Input */}
            {paymentState.method === PaymentMethod.MPESA && (
              <div className="col-span-2 space-y-2">
                <Label>MPESA Phone Number</Label>
                <Input
                  placeholder="07XXXXXXXX"
                  value={paymentState.mpesaPhone || ''}
                  onChange={e => setPaymentState(p => ({
                    ...p,
                    mpesaPhone: e.target.value
                  }))}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Amount Received</Label>
              <NumericFormat
                customInput={Input}
                value={paymentState.amountTendered}
                onValueChange={values => {
                  const amount = values.floatValue || 0;
                  setPaymentState(p => ({
                    ...p,
                    amountTendered: amount,
                    changeDue: Math.max(amount - totalDue, 0)
                  }));
                }}
                thousandSeparator
                decimalScale={2}
                prefix="Ksh "
              />
            </div>

            {paymentState.changeDue > 0 && (
              <div className="col-span-2 p-3 bg-green-50 rounded">
                <div className="flex justify-between">
                  <span>Change Due:</span>
                  <NumericFormat
                    value={paymentState.changeDue}
                    displayType="text"
                    prefix="Ksh "
                    thousandSeparator
                    decimalScale={2}
                    className="font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={paymentState.amountTendered < totalDue || isProcessingPayment}
            >
              {isProcessingPayment ? 'Processing...' : 'Complete Sale'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}