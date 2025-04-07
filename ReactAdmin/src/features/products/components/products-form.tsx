import React, { useState, useEffect } from 'react';
import categoryService from '@/services/categoryService'
import supplierService from '@/services/supplierService'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '../data/products-schema';
import type { z } from 'zod';
import { UploadCloud as UploadIcon, X as XIcon } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import productService from '@/services/productService'; 
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';



export type ProductFormInputs = z.infer<typeof productSchema>;

export interface ProductFormProps {
  suppliers: Array<{ id: number; name: string }>;
  categories: Array<{ id: number; name: string }>;
  defaultValues?: Partial<ProductFormInputs>;
}

export default function ProductForm({
  suppliers: initialSuppliers,
  categories: initialCategories,
  defaultValues = {},
}: ProductFormProps) {
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [categories, setCategories] = useState(initialCategories)


 useEffect(() => {
    const fetchData = async () => {
      if (!initialSuppliers.length) {
        const supplierData = await supplierService.getAllSuppliers()
        setSuppliers(supplierData)
      }
      if (!initialCategories.length) {
        const categoryData = await categoryService.getAllCategories()
        setCategories(categoryData)
      }
    }
    fetchData()
  }, [initialSuppliers, initialCategories])


  const form = useForm<ProductFormInputs>({
  resolver: zodResolver(productSchema),
  defaultValues: {
    ...defaultValues,
    id: defaultValues?.id || 0,
    name: defaultValues?.name || '',
    sku: defaultValues?.sku || '',
    buyingPrice: defaultValues?.buyingPrice || 0,
    sellingPrice: defaultValues?.sellingPrice || 0,
    taxRate: defaultValues?.taxRate || 0,
    isService: defaultValues?.isService || false,
    quantity: defaultValues?.quantity || 0,
    supplierId: defaultValues?.supplierId || suppliers[0]?.id || 0,
    categoryId: defaultValues?.categoryId || categories[0]?.id || 0,
    imageUrl: defaultValues?.imageUrl || '',
    description: defaultValues?.description || null,
    size: defaultValues?.size || null,
    weight: defaultValues?.weight || null,
    galleryImages: defaultValues?.galleryImages || [],
  
    supplierName: defaultValues?.supplierName || '',
    categoryName: defaultValues?.categoryName || '',
    inventoryManager: defaultValues?.inventoryManager || '',
  },
});


  useEffect(() => {
  console.log('Form Errors:', form.formState.errors);
}, [form.formState.errors]);



   const generateSKU = () => {
    const prefix = 'PROD-'
    const randomNumber = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}${randomNumber}`
  }


    const handleNumberInput = (field: any, value: string) => {
    const numValue = parseFloat(value) || 0;
    field.onChange(numValue);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    setMainImage(e.target.files[0]);
    // Preview logic if needed
  }
};

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  }
};


  const removeGalleryImage = (index: number) => {
  setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  form.setValue('galleryImages', 
    form.getValues('galleryImages').filter((_, i) => i !== index)
  );
};

  const handleFormSubmit = async (data: ProductFormInputs) => {

    console.log("Payload data:", data);

  try {
    const files = {
      mainImage,
      galleryImages: galleryFiles
    };

    await productService.createProduct(data, files);
    toast({ title: 'Product created successfully' });
    
    setMainImage(null);
    setGalleryFiles([]);
    
  } catch (error: any) {
    console.error('Submission error:', error);
    toast({ 
      title: 'Error',
      description: error.response?.data?.message || error.message  
    });
  }
};

  return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Product Details Section */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Product Details</h3>
            <Card className="p-6 shadow-md border border-gray-100">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          value={field.value ?? ''}
                          className="focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Describe your product..."
                          {...field}
                          value={field.value || ''} 
                          className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </section>

          {/* Pricing Section */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Pricing</h3>
            <Card className="p-6 shadow-md border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="buyingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Cost Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => handleNumberInput(field, e.target.value)}
                            className="pl-8 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Retail Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">$</span>
                          </div>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => handleNumberInput(field, e.target.value)}
                            className="pl-8 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Tax Rate
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value ?? 0}
                            onChange={(e) => handleNumberInput(field, e.target.value)}
                            className="pr-8 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">%</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </section>

          {/* Media Section */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Media</h3>
            <Card className="p-6 shadow-md border border-gray-100">
              <div className="space-y-6">
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-3">
                    Main Product Image
                  </FormLabel>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors overflow-hidden">
                      {/* Preview or Upload Interface */}
                      {mainImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(mainImage)}
                            alt="Main product preview"
                            className="w-full h-full mainimg-object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMainImage(null);
                              form.setValue('imageUrl', null);
                            }}
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        // Show this when no image is selected
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Show existing image if editing */}
                  {!mainImage && form.getValues('imageUrl') && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                      <img
                        src={form.getValues('imageUrl')}
                        alt="Current product"
                        className="w-32 h-32 mainimg-object-cover object-center rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="galleryImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-3">
                        Gallery Images
                      </FormLabel>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadIcon className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              Upload multiple images
                            </p>
                          </div>
                        <Input
                          type="file"
                          multiple
                          onChange={handleGalleryChange}
                          className="hidden"
                        />
                       </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {galleryFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {galleryFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Gallery ${index}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Inventory Management */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Inventory</h3>
            <Card className="p-6 shadow-md border border-gray-100">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Code</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="PROD-1234"
                            {...field}
                            value={field.value ?? ''}
                            pattern="PROD-\d{4}"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => field.onChange(generateSKU())}
                          >
                            Generate
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Stock Level
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={1}
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) => handleNumberInput(field, e.target.value)}
                          className="focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </section>

          {/* Organization Section */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Organization</h3>
            <Card className="p-6 shadow-md border border-gray-100">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Product Category
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value || ''} 
                          onChange={(e) => handleNumberInput(field, e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        >
                          <option value={0}>Select Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Supplier/Vendor
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value || ''} 
                          onChange={(e) => handleNumberInput(field, e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        >
                          <option value={0}>Select Supplier</option>
                          {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </section>

          {/* Shipping Details */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-gray-800">Shipping</h3>
            <Card className="p-6 shadow-md border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Weight (kg)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ''} 
                            onChange={(e) => handleNumberInput(field, e.target.value)}
                            className="pr-8 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">kg</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Dimensions (L × W × H)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 10×5×3"
                          {...field}
                          value={field.value || ''} 
                          className="focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
        <Button
          type="submit"
          onClick={() => console.log('Button clicked')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Product
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          className="px-6 py-3 text-gray-700 hover:bg-gray-50"
        >
          Discard Changes
        </Button>        
      </div>
    </form>
  </Form>
);
}
