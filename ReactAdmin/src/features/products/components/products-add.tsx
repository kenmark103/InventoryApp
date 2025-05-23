import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import ProductForm, { ProductFormInputs } from './products-form';
import { toast } from '@/hooks/use-toast';
import productService from '@/services/productService';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProductsProvider } from '../context/products-context';
import { useSuppliers } from '@/features/suppliers/context/suppliers-context';
import { useCategories } from '@/features/categories/context/categories-context';

export function AddProduct() {
  const navigate = useNavigate();
  const { suppliers } = useSuppliers();
  const { categories } = useCategories();

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
    <ProductsProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-1">Add Product</h2>
            <p className="text-muted-foreground mb-4">Add your products here.</p>
            <ProductForm 
              suppliers={suppliers} 
              categories={categories} 
              onSubmit={handleSubmit} 
            />
          </div>
        </div>
      </Main>
    </ProductsProvider>
  );
}