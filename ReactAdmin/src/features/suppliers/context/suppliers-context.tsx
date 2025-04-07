// suppliers-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import supplierService from '@/services/supplierService';
import { Supplier } from '../data/supplierSchema'; // adjust path as needed

type SuppliersDialogType = 'add' | 'edit' | 'delete' | null;

interface SuppliersContextType {
  suppliers: Supplier[];
  refreshSuppliers: () => Promise<void>;
  open: SuppliersDialogType;
  setOpen: (val: SuppliersDialogType) => void;
  currentSupplier: Supplier | null;
  setCurrentSupplier: React.Dispatch<React.SetStateAction<Supplier | null>>;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export default function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [open, setOpen] = useState<SuppliersDialogType>(null);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);

  const refreshSuppliers = async () => {
    try {
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch suppliers', error);
    }
  };

  useEffect(() => {
    refreshSuppliers();
  }, []);

  const value: SuppliersContextType = {
    suppliers,
    refreshSuppliers,
    open,
    setOpen,
    currentSupplier,
    setCurrentSupplier,
  };

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  );
}

export const useSuppliers = () => {
  const context = useContext(SuppliersContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SuppliersProvider');
  }
  return context;
};
