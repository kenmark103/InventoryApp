// src/data/purchase-schema.ts
import { z } from "zod";
import { productSchema } from "@/features/products/data/product-schema";
import { supplierSchema } from "@/features/suppliers/data/supplier-schema";


export const purchaseSchema = z.object({
  id: z.number(),
  productId: z.number(),
  supplierId: z.number(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  purchaseDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date()),
  invoiceNumber: z.string().optional(),
  notes: z.string().optional(),
  productName: z.string(), // Add this line
  supplierName: z.string(), // Add this line
  
  product: productSchema.optional(),
  supplier: supplierSchema.optional(),
});

export type Purchase = z.infer<typeof purchaseSchema>;