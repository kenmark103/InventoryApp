
import * as React from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { useSales } from '@/features/sales/context/sales-context';
import { SaleResponseDto } from '@/data/saleSchema';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { statusColors } from '../data/sales-constants'




export const columns: ColumnDef<SaleResponseDto>[] = [
  {
    accessorKey: 'invoiceNumber',
    header: 'Invoice #',
    cell: ({ row }) => (
      <div className="font-medium">
        #{row.getValue('invoiceNumber')}
      </div>
    ),
  },
  {
  accessorKey: 'saleDate',
  header: 'Date',
  cell: ({ row }) => {
    try {
      return format(new Date(row.getValue('saleDate')), 'PP');
    } catch (e) {
      console.error('Invalid date:', row.getValue('saleDate'));
      return 'Invalid date';
    }
  },
  },
  {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const status = row.getValue('status');
    return (
      <Badge 
        variant={
          status === 'paid' ? 'default' : 
          status === 'draft' ? 'secondary' : 
          'outline'
        }
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[status] || 'bg-gray-100 text-gray-800'
                    }`}
      >
        {status}
      </Badge>
    );
  },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => (
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
      }).format(row.getValue('total'))
    ),
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment Method',
    cell: ({ row }) => (
      <span className="capitalize">
        {row.getValue('paymentMethod').toLowerCase()}
      </span>
    ),
  },
  {
  id: 'actions',
  cell: ({ row }) => {
    const navigate = useNavigate();
    const status = row.original.status;
    
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
          onClick={() => navigate({
            to: '/sales/$id',
            params: { id: row.original.id.toString() }
          })}
        >
          <ArrowUpRight className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </div>
    );
  },
},
];

export function SalesOrderTable() {
  const { sales, loading, error } = useSales();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'saleDate', desc: true }]);

  const table = useReactTable({
    data: sales,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error) return <div>Error loading sales orders</div>;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading sales orders...
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No sales orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}