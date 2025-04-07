// src/data/categorySchema.ts
import { z } from 'zod';

export const baseCategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string().nullable().transform(val => val ?? ''),
  status: z.preprocess(
    (val) => (val === "" ? "active" : val),
    z.enum(['active', 'inactive'])
  ),
});

export const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  children: z.lazy(() => categorySchema.array()).default([]), // Recursive definition for subcategories
});

// Infer the TypeScript type from the complete schema
export type Category = z.infer<typeof categorySchema>;

