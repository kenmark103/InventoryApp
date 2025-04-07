/* eslint-disable @typescript-eslint/no-explicit-any */
// CustomersDeleteDialog.tsx
'use client'

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Customer } from '../data/customerSchema';
import { useCustomers } from '../context/customers-context';
import customerService from '@/services/customerService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCustomer: Customer;
}

export function CustomersDeleteDialog({ open, onOpenChange, currentCustomer }: Props) {
  const [value, setValue] = useState('');
  const { refreshCustomers, setCurrentCustomer } = useCustomers();

  const handleDelete = async () => {
    if (value.trim() !== currentCustomer.name) return;

    try {
      await customerService.deleteCustomer(currentCustomer.id);
      await refreshCustomers();
      setCurrentCustomer(null);
      onOpenChange(false);
      toast({
        title: 'Customer deleted successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(currentCustomer, null, 2)}</code>
          </pre>
        ),
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Deletion failed. Please try again.',
      });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentCustomer.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='mr-1 inline-block stroke-destructive' size={18} /> Delete Customer
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete <span className='font-bold'>{currentCustomer.name}</span>? This action cannot be undone.
          </p>
          <Label className='my-2'>
            Customer Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter customer name to confirm deletion.'
            />
          </Label>
          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>Please be careful—this operation cannot be rolled back.</AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  );
}
