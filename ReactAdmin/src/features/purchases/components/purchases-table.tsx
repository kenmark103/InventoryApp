// src/components/purchases/purchases-table.tsx
"use client"

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Purchase } from "../data/purchase-schema";
import { usePurchases } from "../context/purchases-context";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  defaultSort?: { id: string; desc: boolean }[];
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  defaultSort,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      sorting: defaultSort ? [{ id: defaultSort[0].id, desc: defaultSort[0].desc }] : [],
    },
  });

  return (
    <div className={className}>
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 text-left text-sm font-medium">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PurchasesTableProps {
  columns: ColumnDef<Purchase>[];
}

export function PurchasesTable({ columns }: PurchasesTableProps) {
  const { purchases } = usePurchases();

  return (
    <DataTable
      columns={columns}
      data={purchases}
      filterKey="product.name"
      defaultSort={[{ id: "purchaseDate", desc: true }]}
      className="rounded-md border"
    />
  );
}