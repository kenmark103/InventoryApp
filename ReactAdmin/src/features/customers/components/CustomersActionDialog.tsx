/* eslint-disable @typescript-eslint/no-explicit-any */
// CustomersActionDialog.tsx
'use client'

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import customerService from '@/services/customerService';
import { Customer } from '../data/customerSchema';
import { useCustomers } from '../context/customers-context';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email.' }).nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  company: z.string().nullable(),
});
type CustomerForm = z.infer<typeof formSchema>;

interface Props {
  currentCustomer?: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomersActionDialog({ currentCustomer, open, onOpenChange }: Props) {
  const isEdit = !!currentCustomer;
  const { refreshCustomers } = useCustomers();
  const form = useForm<CustomerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? { ...currentCustomer }
      : { name: '', email: '', phone: '', address: '', company: '' },
  });

  const onSubmit = async (values: CustomerForm) => {
    try {
      if (isEdit) {
        await customerService.updateCustomer(currentCustomer!.id, values);
        toast({
          title: 'Customer updated successfully',
          description: 'The customer details have been updated.',
        });
      } else {
        await customerService.createCustomer(values);
        toast({
          title: 'Customer created successfully',
          description: 'A new customer has been added.',
        });
      }
      await refreshCustomers();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong.',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update customer details.' : 'Fill in the details to add a new customer.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id='customer-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Similarly add fields for email, phone, address, and company */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder='+1234567890' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder='123 Main St' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder='Company Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='customer-form'>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
