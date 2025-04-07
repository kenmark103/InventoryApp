/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Product } from '../data/productSchema';
import { useProducts } from '../context/products-context';
import productService from '@/services/productService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProduct: Product;
}

export function ProductsDeleteDialog({ open, onOpenChange, currentProduct }: Props) {
  const [value, setValue] = useState('');
  const { refreshProducts, setCurrentProduct } = useProducts();

  const handleDelete = async () => {
    // Confirm deletion only if the user typed the product name exactly
    if (value.trim() !== currentProduct.name) return;

    try {
      await productService.deleteProduct(currentProduct.id);
      await refreshProducts();
      setCurrentProduct(null);
      onOpenChange(false);
      toast({
        title: 'Product deleted successfully',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(currentProduct, null, 2)}</code>
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
      disabled={value.trim() !== currentProduct.name}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete Product
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{currentProduct.name}</span>?
          </p>
          <Label className="my-2">
            Product Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter product name to confirm deletion."
            />
          </Label>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
