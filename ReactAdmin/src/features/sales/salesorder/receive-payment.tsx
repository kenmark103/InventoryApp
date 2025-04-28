// components/receive-payment.tsx
'use client';
import { useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
// Add form components as needed

export function ReceivePayment() {
  const { id } = useParams({ strict: false });
  // Form setup and submission logic

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-6">Receive Payment</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Payment method selection */}
          {/* Amount input */}
          {/* Transaction details */}
          
          <div className="flex gap-4 justify-end">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Process Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}