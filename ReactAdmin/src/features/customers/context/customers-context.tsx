// customers-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import customerService from '@/services/customerService';
import { Customer } from '../data/customerSchema'; // adjust path as needed

type CustomersDialogType = 'add' | 'edit' | 'delete' | null;

interface CustomersContextType {
  customers: Customer[];
  refreshCustomers: () => Promise<void>;
  open: CustomersDialogType;
  setOpen: (val: CustomersDialogType) => void;
  currentCustomer: Customer | null;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export default function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState<CustomersDialogType>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const refreshCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch customers', error);
    }
  };

  useEffect(() => {
    refreshCustomers();
  }, []);

  const value: CustomersContextType = {
    customers,
    refreshCustomers,
    open,
    setOpen,
    currentCustomer,
    setCurrentCustomer,
  };

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};
