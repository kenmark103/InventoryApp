import { useSales } from '../context/sales-context';;
import { useEffect, useState } from 'react';
import customerService from '@/services/customerService';

export function CustomerSelector() {
  const { currentSale, setCurrentSale } = useSales();
  const [customers, setCustomers] = useState<Customer[]>([]);


  useEffect(() => {
  let isMounted = true;
  
  const loadCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      if (isMounted) setCustomers(data);
    } catch (error) {
      if (isMounted) console.error('Failed to load customers:', error);
    }
  };

  loadCustomers();
  return () => { isMounted = false };
}, []);


  
  return (
    <select
      value={currentSale?.customerId || ''}
      onChange={(e) => setCurrentSale(prev => ({
        ...prev,
        customerId: Number(e.target.value)
      }))}
      className="p-2 border rounded-lg bg-white dark:bg-gray-800"
    >
      <option value="">Select Customer</option>
      {customers.map(customer => (
        <option key={customer.id} value={customer.id}>
          {customer.name}
        </option>
      ))}
    </select>
  );
}