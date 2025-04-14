"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import purchaseService from '@/services/purchaseService';
import { Purchase } from '../data/purchase-schema';
import { useProducts } from "@/features/products/context/products-context";
import { useSuppliers } from "@/features/suppliers/context/suppliers-context";

type DialogMode = 'create' | 'view' | 'edit' | 'delete' | null;

interface PurchasesContextType {
  purchases: Purchase[];
  refreshPurchases: () => Promise<void>;
  dialogMode: DialogMode;
  openDialog: (mode: DialogMode, purchase?: Purchase) => void;
  closeDialog: () => void;
  currentPurchase: Purchase | null;
  createPurchase: (data: Omit<Purchase, 'id'>) => Promise<void>;
  updatePurchase: (id: number, data: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: number) => Promise<void>;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export function PurchasesProvider({ children }: { children: React.ReactNode }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const { refreshProducts } = useProducts();
  const { refreshSuppliers } = useSuppliers();

  const openDialog = (mode: DialogMode, purchase?: Purchase) => {
    setDialogMode(mode);
    setCurrentPurchase(purchase || null);
  };

  const closeDialog = () => {
    setDialogMode(null);
    setCurrentPurchase(null);
  };

  const refreshPurchases = async () => {
    try {
      const data = await purchaseService.getAllPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Failed to fetch purchases', error);
    }
  };

  const handleCreatePurchase = async (data: Omit<Purchase, 'id'>) => {
    await purchaseService.createPurchase(data);
    await Promise.all([refreshPurchases(), refreshProducts(), refreshSuppliers()]);
    closeDialog();
  };

  const handleUpdatePurchase = async (id: number, data: Partial<Purchase>) => {
    await purchaseService.updatePurchase(id, data);
    await Promise.all([refreshPurchases(), refreshProducts(), refreshSuppliers()]);
    closeDialog();
  };

  const handleDeletePurchase = async (id: number) => {
    await purchaseService.deletePurchase(id);
    await Promise.all([refreshPurchases(), refreshProducts(), refreshSuppliers()]);
    closeDialog();
  };

  useEffect(() => {
    refreshPurchases();
  }, []);

  return (
    <PurchasesContext.Provider value={{
      purchases,
      refreshPurchases,
      dialogMode,
      openDialog,
      closeDialog,
      currentPurchase,
      createPurchase: handleCreatePurchase,
      updatePurchase: handleUpdatePurchase,
      deletePurchase: handleDeletePurchase,
    }}>
      {children}
    </PurchasesContext.Provider>
  );
}

export const usePurchases = () => {
  const ctx = useContext(PurchasesContext);
  if (!ctx) throw new Error('usePurchases must be used within PurchasesProvider');
  return ctx;
};