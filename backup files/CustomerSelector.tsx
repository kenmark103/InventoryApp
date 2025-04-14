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

export function CustomerSelector() {
  const { currentSale, setCurrentSale } = useSales();
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await customerService.getAllCustomers();
        setCustomers(data);
        // Set default customer ID 4 if not already set
        if (!currentSale?.customerId) {
          setCurrentSale(prev => ({ ...prev, customerId: 4 }));
        }
      } catch (error) {
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