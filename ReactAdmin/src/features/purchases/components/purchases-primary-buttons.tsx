// src/components/purchases/purchases-primary-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePurchases } from "../context/purchases-context";

export function PurchasesPrimaryButtons() {
  const { openDialog } = usePurchases();

  return (
    <Button onClick={() => openDialog('create')}>
      <Plus className="mr-2 h-4 w-4" />
      New Purchase
    </Button>
  );
}