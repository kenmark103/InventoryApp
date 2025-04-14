// src/components/purchases/columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Purchase } from "@/data/purchase-schema";
import { Button } from "@/components/ui/button";
import { PurchasesDialog } from "./purchase-dialogs";
import { format } from "date-fns";
import { Eye, Edit, Trash } from 'lucide-react';
import { usePurchases } from "../context/purchases-context";

export const purchaseColumns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.productName}</div> 
    ),
  },
  {
    accessorKey: "supplierName", 
    header: "Supplier",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.supplierName}</div> 
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => (
      <div>${row.original.unitPrice.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => (
      <div>${row.original.totalPrice.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "purchaseDate",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.purchaseDate), "MMM dd, yyyy")}</div>
    ),
  },
  {
  id: "actions",
  cell: ({ row }) => {
    const { openDialog } = usePurchases();
    const purchase = row.original;

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => openDialog('view', purchase)}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => openDialog('edit', purchase)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => openDialog('delete', purchase)}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>

      </div>
    );
  },
},

];