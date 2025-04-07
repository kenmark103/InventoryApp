import { ColumnDef } from "@tanstack/react-table";
import { SaleItem } from "../data/saleSchema"; 
import { useSales } from '../context/sales-context';

const columns: ColumnDef<SaleItem>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    size: 100,
    cell: ({ row }) => (
      <img 
        src={row.original.imageUrl} 
        alt={row.original.name}
        className="h-10 w-10 object-cover rounded"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Product Name",
    size: 200,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 120,
    cell: ({ row }) => (
      <input
        type="number"
        value={row.original.quantity}
        onChange={(e) => {
          const newQuantity = parseInt(e.target.value);
          if (!isNaN(newQuantity)) {
            useSales().updateItem(row.original.id, { quantity: newQuantity });
          }
        }}
        className="w-20 px-2 py-1 border rounded"
      />
    ),
  },
  {
    accessorKey: "taxRate",
    header: "Tax Rate",
    size: 120,
    cell: ({ row }) => `${(row.original.taxRate * 100).toFixed(0)}%`,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    size: 120,
    cell: ({ row }) => (
      <input
        type="number"
        value={row.original.discount || 0}
        onChange={(e) => {
          const newDiscount = parseFloat(e.target.value);
          if (!isNaN(newDiscount)) {
            useSales().updateItem(row.original.id, { discount: newDiscount });
          }
        }}
        className="w-20 px-2 py-1 border rounded"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => (
      <button
        onClick={() => useSales().removeItem(row.original.id)}
        className="text-red-500 hover:text-red-700"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    ),
  },
];