// features/expenses/context/approve-expenses-context.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Expense } from '../data/expense-schema';
import expenseService from '@/services/expenseService';

type DialogType = 'reject' | null;

interface ApproveExpensesContextType {
  expenses: Expense[];
  loading: boolean;
  refreshExpenses: () => Promise<void>;
  currentRow: Expense | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Expense | null>>;
  open: DialogType | null;
  setOpen: (type: DialogType | null) => void;
}

const Context = createContext<ApproveExpensesContextType | null>(null);

export function ApproveExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRow, setCurrentRow] = useState<Expense | null>(null);
  const [open, setOpen] = useState<DialogType | null>(null);

  const refreshExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getPendingExpenses();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  return (
    <Context.Provider value={{ expenses, loading, refreshExpenses, currentRow, setCurrentRow, open, setOpen }}>
      {children}
    </Context.Provider>
  );
}

export const useApproveExpenses = () => {
  const context = useContext(Context);
  if (!context) throw new Error('useApproveExpenses must be used within ApproveExpensesProvider');
  return context;
};