import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.number(),
  type: z.string(),
  amount: z.number(),
  description: z.string().optional().nullable().transform(val => val ?? undefined),
  vendor: z.string().optional().nullable().transform(val => val ?? undefined),
  receiptUrl: z.string().optional(),
});

export type Expense = z.infer<typeof expenseSchema>;