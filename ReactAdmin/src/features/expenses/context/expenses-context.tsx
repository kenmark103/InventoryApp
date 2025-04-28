import React, { useState, useEffect } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Expense } from '../data/expense-schema';
import expenseService from "@/services/expenseService";

type ExpensesDialogType = 'create' | 'update' | 'delete' | 'import';

interface ExpensesContextType {
  open: ExpensesDialogType | null;
  setOpen: (str: ExpensesDialogType | null) => void;
  currentRow: Expense | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Expense | null>>;
  expenses: Expense[];
  loading: boolean;
  refreshExpenses: () => Promise<void>;
}

const ExpensesContext = React.createContext<ExpensesContextType | null>(null);

interface Props {
  children: React.ReactNode;
}


export function ExpensesProvider({ children }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<ExpensesDialogType | null>(null);
  const [currentRow, setCurrentRow] = useState<Expense | null>(null);

  const refreshExpenses = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getMyExpenses();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  return (
    <ExpensesContext.Provider value={{ 
      open,
      setOpen,
      currentRow,
      setCurrentRow,
      expenses,
      loading,
      refreshExpenses,
      
    }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export const useExpenses = () => {
  const expensesContext = React.useContext(ExpensesContext);

  if (!expensesContext) {
    throw new Error('useExpenses has to be used within <ExpensesProvider>');
  }

  return expensesContext;
};