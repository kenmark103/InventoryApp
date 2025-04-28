import { useSales } from '../context/sales-context';;
import { useEffect, useState } from 'react';
import customerService from '@/services/customerService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Customer } from "@/features/customers/data/customerSchema";

export function CustomerSelector() {
   const { currentSale, setCurrentSale } = useSales();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await customerService.getAllCustomers();
        setCustomers(data);
        
        if (!currentSale?.customerId) {
          setCurrentSale(prev => ({ ...prev, customerId: 4 }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load customers:', error);
      }
    };

    loadCustomers();
  }, []);

  return (
    <Select
      value={currentSale?.customerId?.toString() || '4'}
      onValueChange={value => setCurrentSale(prev => ({
        ...prev,
        customerId: Number(value)
      }))}
    >
      <SelectTrigger className="w-[240px] bg-background">
        <SelectValue placeholder="Select customer" />
      </SelectTrigger>
      <SelectContent>
        {customers.map(customer => (
          <SelectItem key={customer.id} value={customer.id.toString()}>
            {customer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}