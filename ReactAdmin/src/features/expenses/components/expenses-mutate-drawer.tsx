import { z } from 'zod';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { SelectDropdown } from '@/components/select-dropdown';
import { Expense, expenseSchema } from '../data/expense-schema';
import { expenseTypes } from '../data/expenseConstants';
import { useExpenses } from '../context/expenses-context';
import expenseService from "@/services/expenseService";
import { useSuppliers } from '@/features/suppliers/context/suppliers-context';
import { Textarea } from '@/components/ui/textarea';


const formSchema = expenseSchema.omit({
  id: true,
  receiptUrl: true,
}).extend({
  receipt: z.instanceof(File).optional().nullable(),
}).refine(data => data.description === null ? undefined : data.description, {
  path: ['description'],
}).refine(data => data.vendor === null ? undefined : data.vendor, {
  path: ['vendor'],
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: Expense;
}

export function ExpensesMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const { refreshExpenses } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { suppliers } = useSuppliers();
  const previousRowId = useRef<number | undefined>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      amount: 0,
      description: '',
      vendor: '',
      receipt: undefined,
    },
  });

  useEffect(() => {
  if (currentRow?.id !== previousRowId.current) {
    if (currentRow) {
      form.reset({
        type: currentRow.type,
        amount: currentRow.amount,
        description: currentRow.description || '', 
        vendor: currentRow.vendor || '',
        receipt: undefined,
      });
      previousRowId.current = currentRow.id;
    } else {
      form.reset({
        type: '',
        amount: 0,
        description: '',
        vendor: '',
        receipt: undefined,
      });
      previousRowId.current = undefined;
    }
  }
}, [currentRow?.id]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      formData.append('Type', values.type);
      formData.append('Amount', values.amount.toString());
      formData.append('Description', values.description || '');
      formData.append('Vendor', values.vendor || '');
      
      if (values.receipt) {
        formData.append('Receipt', values.receipt);
      }

      if (currentRow) {
        await expenseService.approveExpense(currentRow.id, formData);
      } else {
        await expenseService.createExpense(formData);
      }

      refreshExpenses();
      onOpenChange(false);
      toast({ title: `Expense ${currentRow ? 'updated' : 'created'} successfully` });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) form.reset();
      }}
    >
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>{currentRow ? 'Update' : 'Create'} Expense</SheetTitle>
          <SheetDescription>
            {currentRow
              ? 'Update the expense details below.'
              : 'Add a new expense by filling in the required fields.'}
          </SheetDescription>
        </SheetHeader>
        
        <Form {...form}>
          <form 
            id="expenses-form" 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex-1 space-y-5 mt-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Type</FormLabel>
                  <SelectDropdown
                    items={expenseTypes}
                    onValueChange={field.onChange}
                    value={field.value}
                    placeholder="Select expense type"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
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
                  <FormItem className="space-y-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter expense description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Vendor Field */}
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="text"
                        list="vendors-list"
                        placeholder="Select or enter vendor"
                        value={field.value || ''}
                      />
                      <datalist id="vendors-list">
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.name} />
                        ))}
                      </datalist>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Receipt</FormLabel>
                  {currentRow?.receiptUrl && (
                    <div className="mb-2">
                      <a
                        href={currentRow.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View current receipt
                      </a>
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button 
            type="submit"
            form="expenses-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}