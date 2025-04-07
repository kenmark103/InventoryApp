// categories-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import categoryService from '@/services/categoryService';
import { Category } from '../data/categorySchema'; // use your categories schema

type CategoriesDialogType = 'add' | 'edit' | 'delete' | null;

interface CategoriesContextType {
  categories: Category[];
  refreshCategories: () => Promise<void>;
  open: CategoriesDialogType;
  setOpen: (val: CategoriesDialogType) => void;
  currentCategory: Category | null;
  setCurrentCategory: React.Dispatch<React.SetStateAction<Category | null>>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export default function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState<CategoriesDialogType>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const refreshCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const value: CategoriesContextType = {
    categories,
    refreshCategories,
    open,
    setOpen,
    currentCategory,
    setCurrentCategory,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};