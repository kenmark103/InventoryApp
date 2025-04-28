/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender 
} from '@tanstack/react-table';
import { useSales } from '../context/sales-context';
import { useMemo, useState } from 'react';
import { createSalesColumns } from './SalesColumns';
import React, { useEffect } from 'react';


export function SalesTable() {
  const { currentSale, updateItem, removeItem } = useSales();
  const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
    if (!currentSale) {
      setEditingId(null);
    }
  }, [currentSale]);

  const columns = useMemo(
    () => createSalesColumns(updateItem, removeItem, setEditingId, editingId),
    [updateItem, removeItem, editingId]
  );

  const table = useReactTable({
    data: currentSale?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id?.toString() || Math.random().toString(),
  });





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