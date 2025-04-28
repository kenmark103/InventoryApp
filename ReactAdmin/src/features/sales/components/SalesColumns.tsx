
import { ColumnDef } from "@tanstack/react-table";
import { SaleItem } from "../data/sales-schema";
import { TrashIcon } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { getImageUrl } from '@/utils/apiHelpers';
import { QuantityStepper } from "./QuantityStepper";
import { DiscountInput } from "./DiscountInput";
import { getCurrencySymbol, formatCurrency } from '../utils/formatting';

export const createSalesColumns = (
  updateItem: (productId: number, update: Partial<SaleItem>) => void,
  removeItem: (productId: number) => void,
  handleStartEdit: (productId: number) => void,
  editingId: number | null
): ColumnDef<SaleItem>[] => [
  {
    accessorKey: "imageUrl",
    header: "Image",
    size: 70,
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl 
        ? getImageUrl(row.original.imageUrl)
        : '/images/placeholder.png';
        
      return (
        <img 
          src={imageUrl}
          alt={row.original.name}
          className="h-10 w-10 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.png';
          }}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-gray-500">{row.original.sku}</span>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => (
      <QuantityStepper
        item={row.original}
        onUpdate={(newQty) => updateItem(row.original.productId, { quantity: newQty })}
      />
    ),
  },
  {
    accessorKey: "price",
    header: "Unit Price",
    cell: ({ row }) => (
      <NumericFormat
        value={row.original.price}
        displayType="text"
        thousandSeparator
        prefix={getCurrencySymbol('KES')}
        decimalScale={2}
      />
    ),
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <DiscountInput
        value={row.original.discount || 0}
        onChange={(value) => updateItem(row.original.productId, { discount: value })}
      />
    ),
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const item = row.original;
      const subtotal = (item.price * item.quantity) - (item.discount || 0);
      const total = subtotal * (1 + item.taxRate);
      
      return formatCurrency(total, 'KES');
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        onClick={() => removeItem(row.original.productId)}
        className="text-red-500 hover:text-red-700"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    ),
  },
];