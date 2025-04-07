import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialog-state';
import { Expense } from '../data/expense-schema';

type ExpensesDialogType = 'create' | 'update' | 'delete' | 'import';

interface ExpensesContextType {
  open: ExpensesDialogType | null;
  setOpen: (str: ExpensesDialogType | null) => void;
  currentRow: Expense | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Expense | null>>;
}

const ExpensesContext = React.createContext<ExpensesContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function ExpensesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ExpensesDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Expense | null>(null);

  return (
    <ExpensesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
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
