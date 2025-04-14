
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { useSales } from '../context/sales-context';
import { useState, useMemo } from 'react';
import { NumericFormat } from 'react-number-format';
import { getImageUrl } from '@/utils/apiHelpers'; 


type SaleItem = {
  id: number;
  name: string;
  sku: string;
  sellingPrice: number;
  buyingPrice: number;
  taxRate: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
  discount?: number;
};

type SalesTableProps = {
  items: SaleItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
};

const columnHelper = createColumnHelper<SaleItem>();

export function SalesTable() {

  const { currentSale, updateItem, removeItem } = useSales();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Always use safe array access
  const saleItems = currentSale?.items || [];


  const columns = useMemo(() => [
    columnHelper.accessor('imageUrl', {
      header: 'image',
      cell: ({ getValue }) => (
        <div className="w-12 h-12">
          <img
            src={getImageUrl(getValue()) || '/placeholder-product.jpg'}
            alt="Product"
            className="w-full h-full object-contain rounded-md"
          />
        </div>
      ),
      size: 70,
    }),
    columnHelper.accessor('name', {
      header: 'Product',
      cell: ({ row, getValue }) => {
        const item = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{getValue()}</span>
            <span className="text-xs text-gray-500">{item.sku}</span>
          </div>
        );
      },
    }),

    columnHelper.accessor('quantity', {
      header: 'Qty',
      cell: ({ row, getValue }) => {
        const item = row.original;
        return editingId === item.id ? (
          <input
            type="number"
            value={getValue()}
            onChange={(e) => {
              const newQty = Math.min(Math.max(parseInt(e.target.value), 1), item.stock);
              handleQuantityChange(item.id, newQty);
            }}
            className="w-20 px-2 py-1 border rounded"
            min="1"
            max={item.stock}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditingId(item.id)}
            className="hover:bg-gray-100 px-3 py-1 rounded"
          >
            {getValue()}
          </button>
        );
      },
    }),
    columnHelper.accessor('sellingPrice', {
      header: 'Unit Price',
      cell: ({ getValue }) => (
        <NumericFormat
          value={getValue()}
          displayType="text"
          thousandSeparator
          prefix="$"
          decimalScale={2}
        />
      ),
    }),
    columnHelper.accessor('taxRate', {
      header: 'Tax',
      cell: ({ getValue }) => `${(getValue() * 100).toFixed(1)}%`,
    }),
    columnHelper.accessor('discount', {
      header: 'Discount',
      cell: ({ row }) => (
        <NumericFormat
          value={row.original.discount || 0}
          onValueChange={(values) => 
            handleDiscountChange(row.original.id, values.floatValue || 0)
          }
          prefix="$"
          decimalScale={2}
          className="w-24 px-2 py-1 border rounded"
        />
      ),
    }),
    columnHelper.display({
      id: 'total',
      header: 'Total',
      cell: ({ row }) => {
        const item = row.original;
        const total = item.sellingPrice * item.quantity * (1 + item.taxRate) - (item.discount || 0);
        return (
          <NumericFormat
            value={total}
            displayType="text"
            thousandSeparator
            prefix="$"
            decimalScale={2}
            className="font-semibold"
          />
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => removeItem(row.original.id)}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      ),
    }),
  ], [editingId, updateItem, removeItem]);

  const table = useReactTable({
    data: currentSale?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleQuantityChange = (id: number, quantity: number) => {
    updateItem(id, { quantity });
    setEditingId(null);
  };

  const handleDiscountChange = (id: number, discount: number) => {
    updateItem(id, { discount });
  };

  return (
    <div className="rounded-lg border dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                  style={{ width: header.getSize() }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
     
      {/* Empty State */}
      {table.getRowModel().rows.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No items added. Drag products here or use the quick add buttons.
        </div>
      )}
    </div>
  );
}