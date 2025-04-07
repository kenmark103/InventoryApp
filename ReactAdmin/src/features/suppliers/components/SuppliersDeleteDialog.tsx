'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Supplier } from '../data/supplierSchema';
import { useSuppliers } from '../context/suppliers-context';
import supplierService from '@/services/supplierService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSupplier: Supplier;
}

export function SuppliersDeleteDialog({ open, onOpenChange, currentSupplier }: Props) {
  const [value, setValue] = useState('');
  const { refreshSuppliers, setCurrentSupplier } = useSuppliers();

  const handleDelete = async () => {
    if (value.trim() !== currentSupplier.name) return;

    try {
      await supplierService.deleteSupplier(currentSupplier.id);
      await refreshSuppliers();
      setCurrentSupplier(null);
      onOpenChange(false);
      toast({
        title: 'Supplier deleted successfully',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(currentSupplier, null, 2)}</code>
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
      disabled={value.trim() !== currentSupplier.name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle className='mr-1 inline-block stroke-destructive' size={18} /> Delete Supplier
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete <span className='font-bold'>{currentSupplier.name}</span>? This action cannot be undone.
          </p>
          <Label className='my-2'>
            Supplier Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter supplier name to confirm deletion.'
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
