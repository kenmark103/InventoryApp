/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Category } from '../data/categorySchema';
import { useCategories } from '../context/categories-context';
import categoryService from '@/services/categoryService';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: Category;
}

export function CategoriesDeleteDialog({ open, onOpenChange, currentCategory }: Props) {
  const [value, setValue] = useState('');
  const { refreshCategories, setCurrentCategory } = useCategories();

  // Check if the category has subcategories by using the 'children' property.
  const hasSubcategories = currentCategory.children && currentCategory.children.length > 0;

  const handleDelete = async () => {
    // Confirm deletion only if the user typed the category name exactly
    if (value.trim() !== currentCategory.name) return;

    try {
      await categoryService.deleteCategory(currentCategory.id);
      await refreshCategories();
      setCurrentCategory(null);
      onOpenChange(false);
      toast({
        title: 'Category deleted successfully',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(currentCategory, null, 2)}</code>
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
      disabled={value.trim() !== currentCategory.name}
      title={
        <span className="text-destructive">
          <IconAlertTriangle className="mr-1 inline-block stroke-destructive" size={18} /> Delete Category
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete <span className="font-bold">{currentCategory.name}</span>?
          </p>
          {hasSubcategories && (
            <Alert variant="destructive">
              <AlertTitle>Warning!</AlertTitle>
              <AlertDescription>
                This category has subcategories which will also be deleted. This action cannot be undone.
              </AlertDescription>
            </Alert>
          )}
          <Label className="my-2">
            Category Name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter category name to confirm deletion."
            />
          </Label>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}
