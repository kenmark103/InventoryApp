import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import ProductForm, { ProductFormInputs } from './products-form';
import { toast } from '@/hooks/use-toast';
import productService from '@/services/productService';

const suppliers = [{ id: 1, name: 'Supplier A' }, { id: 2, name: 'Supplier B' }];
const categories = [{ id: 1, name: 'Category X' }, { id: 2, name: 'Category Y' }];

export function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [defaultValues, setDefaultValues] = useState<Partial<ProductFormInputs>>({});

  useEffect(() => {
    if (id) {
      productService
        .getProduct(Number(id))
        .then((data) => setDefaultValues(data))
        .catch((error) =>
          toast({ title: 'Error', description: error.message })
        );
    }
  }, [id]);

  const handleSubmit = async (data: ProductFormInputs, galleryFiles: File[]) => {
    try {
      await productService.updateProduct(Number(id), data, galleryFiles);
      toast({ title: 'Product updated successfully' });
      navigate({ to: `/products` });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Edit Product</h2>
      <p className="text-muted-foreground">Edit your product here.</p>
      <ProductForm
        suppliers={suppliers}
        categories={categories}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
}
