import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import ProductForm, { ProductFormInputs } from './products-form';
import { toast } from '@/hooks/use-toast';
import productService from '@/services/productService';
import supplierService from '@/services/supplierService';
import categoryService from '@/services/categoryService';

const suppliers = await supplierService.getAllSuppliers()
const categories = await categoryService.getAllCategories()

export function AddProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductFormInputs, galleryFiles: File[]) => {
    try {
      await productService.createProduct(data, galleryFiles);
      toast({ title: 'Product created successfully' });
      navigate({ to: `/products` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-1">Add Product</h2>
      <p className="text-muted-foreground mb-4">Add your products here.</p>
      <ProductForm suppliers={suppliers} categories={categories} onSubmit={handleSubmit} />
    </div>
  );
}
