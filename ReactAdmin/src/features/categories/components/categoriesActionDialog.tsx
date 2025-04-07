/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import categoryService from '@/services/categoryService';
import { Category } from '../data/categorySchema';
import { useCategories } from '../context/categories-context';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().nullable(), // Added description
  status: z.enum(['active', 'inactive']),
  parentId: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() !== '') {
        return Number(val);
      }
      return null;
    },
    z.number().nullable()
  ),
});


type CategoryForm = z.infer<typeof formSchema>;

interface Props {
  currentCategory?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoriesActionDialog({ currentCategory, open, onOpenChange }: Props) {
  const isEdit = !!currentCategory;
  const { refreshCategories } = useCategories();
  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { ...currentCategory }
      : { name: '', status: 'active', parentId: null },
  });

  const onSubmit = async (values: CategoryForm) => {
    try {
      if (isEdit) {
        await categoryService.updateCategory(currentCategory!.id, values);
        toast({
          title: 'Category updated successfully',
          description: 'The category details have been updated.',
        });
      } else {
        await categoryService.createCategory(values);
        toast({
          title: 'Category created successfully',
          description: 'A new category has been added.',
        });
      }
      await refreshCategories();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update category details.' : 'Fill in the details to add a new category.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="category-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Category Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="active or inactive" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional: Parent ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="category-form">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
