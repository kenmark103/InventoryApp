// customerSchema.ts
import { z } from 'zod';

export const supplierSchema = z.object({
  id: z.coerce.number(), // converts string input to a number if needed
  name: z.string(),
  email: z.string().nullable(),      // email may be null
  phone: z.string().nullable(),      // phone may be null
  address: z.string().nullable(),    // address may be null
  company: z.string().nullable(),    // company may be null
  createdAt: z.coerce.date(),
}).passthrough();

export type Supplier = z.infer<typeof supplierSchema>;

export const SupplierListSchema = z.array(supplierSchema);
