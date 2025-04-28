// src/data/product-schema.ts
import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  buyingPrice: z.number().min(0, "Must be ≥ 0"),
  sellingPrice: z.number().min(0, "Must be ≥ 0"),
  taxRate: z.number().min(0).max(100, "Max 100%"),
  isService: z.boolean().default(false),
  quantity: z.number().int().min(0),
  supplierId: z.number().positive(),
  supplierName: z.string().min(1),
  categoryId: z.number().positive(),
  categoryName: z.string().min(1),
  inventoryManager: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  description: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  galleryImages: z.array(z.string().url()).default([]),
  createdAt: z.coerce.date().default(() => new Date())
});

export type Product = z.infer<typeof productSchema>;