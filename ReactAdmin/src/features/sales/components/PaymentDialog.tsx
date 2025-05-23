import React, { useState, useEffect } from 'react';
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

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({ open, onOpenChange }: PaymentDialogProps) {
  const { currentSale, completeSale, setCurrentSale, isProcessingPayment, paymentError, setPaymentError } = useSales();
  const [isMounted, setIsMounted] = useState(false);


  const totalDue = currentSale?.totals?.grandTotal || 0;


  const [paymentState, setPaymentState] = useState<PaymentDetails>({
    method: PaymentMethod.CASH,
    amountTendered: totalDue,
    changeDue: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    if (currentSale?.totals) {
      setPaymentState(prev => ({
        ...prev,
        amountTendered: currentSale.totals.grandTotal,
        changeDue: 0
      }));
    }
  }, [currentSale]);

  
  useEffect(() => {
    if (isMounted && currentSale?.totals) {
      setPaymentState(prev => ({
        ...prev,
        amountTendered: currentSale.totals.grandTotal,
        changeDue: Math.max(prev.amountTendered - currentSale.totals.grandTotal, 0)
      }));
    }
  }, [currentSale?.totals?.grandTotal, isMounted]);

  const handleMethodChange = (method: PaymentMethod) => {
    setPaymentError(null);

    if (currentSale) {
      setCurrentSale({
        ...currentSale,
        paymentMethod: method,
      });
    } 

    const baseState = {
      method,
      amountTendered: totalDue,
      changeDue: 0,
    };

    if (method === PaymentMethod.MPESA) {
      setPaymentState({
        ...baseState,
        mpesaPhone: ''
      });
    } else {
      setPaymentState(baseState);
    }

  };

  const handleSubmit = async () => {
    if (paymentState.method === PaymentMethod.MPESA) {
      if (!('mpesaPhone' in paymentState)) {
        setPaymentError('MPESA phone number required');
        return;
      }
      if (!paymentState.mpesaPhone?.startsWith('07')) {
        setPaymentError('Invalid MPESA phone number');
        return;
      }
    }

    try {
      await completeSale(paymentState);
      onOpenChange(false);
    } catch (error) {
      toast.error('Payment processing failed');
    }
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
                onValueChange={(val) => handleMethodChange(val as PaymentMethod)}
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

            {paymentState.method === PaymentMethod.MPESA && (
              <div className="col-span-2 space-y-2">
                <Label>MPESA Phone Number</Label>
                <Input
                  placeholder="07XXXXXXXX"
                  value={paymentState.method === PaymentMethod.MPESA ? paymentState.mpesaPhone : ''}
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
                onValueChange={({ floatValue }) => {
                  const amount = floatValue || 0;
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