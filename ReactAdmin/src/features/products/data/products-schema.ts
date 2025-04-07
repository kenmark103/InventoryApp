import { z } from "zod";



export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  sku: z.string().min(1),
  buyingPrice: z.number(),
  sellingPrice: z.number(),
  taxRate: z.number(),
  isService: z.boolean(),
  quantity: z.number().transform(val => val),
  supplierId: z.number(),
  supplierName: z.string(),
  categoryId: z.number(),
  categoryName: z.string(), 
  inventoryManager: z.string(), 
  imageUrl: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  galleryImages: z.array(z.string()), 
  createdAt:  z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date().optional()),
});



export type Product = z.infer<typeof productSchema>;
