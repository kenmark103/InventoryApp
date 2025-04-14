"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PurchaseForm } from "./purchase-form";
import { usePurchases } from "../context/purchases-context";
import { Loader2 } from "lucide-react";

export function PurchasesDialog() {
  const {
    dialogMode,
    currentPurchase,
    closeDialog,
    deletePurchase,
  } = usePurchases();

  if (!dialogMode) return null;

  // Delete confirmation dialog
  if (dialogMode === 'delete') {
    return (
      <Dialog open={dialogMode === 'delete'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Purchase</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this purchase?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (currentPurchase) {
                  await deletePurchase(currentPurchase.id);
                }
                closeDialog();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Create/View/Edit dialog
  const title = {
    create: 'New Purchase',
    view: 'View Purchase',
    edit: 'Edit Purchase'
  }[dialogMode];

  return (
    <Dialog open={!!dialogMode} onOpenChange={closeDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <PurchaseForm
          purchase={dialogMode === 'create' ? undefined : currentPurchase}
          mode={dialogMode}
          onClose={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
}