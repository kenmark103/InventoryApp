import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { expenseTypes, expensePriorities, expenseStatuses } from '../data/expenseConstants';
import { Expense } from '../data/expense-schema'; // Ensure Expense type is defined
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { capitalize } from "@/utils/strings";
import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
} from '@tabler/icons-react';


export const columns: ColumnDef<Expense>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">#{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = expenseTypes.find(t => t.value === row.getValue('type'));
      return (
        <div className="flex space-x-2">
          {type && <Badge variant="outline">{type.label}</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        Kes{row.original.amount.toFixed(2)}
        <span className="text-muted-foreground ml-2 text-sm">
          (Tax: Kes{row.original.taxAmount.toFixed(2)})
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      new Date(row.getValue('date')).toLocaleDateString()
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),

  cell: ({ row }) => {
    try {
      const statusValue = capitalize(row.getValue('status')?.toString() || '');

      const status = expenseStatuses.find(s => s.value === statusValue) || {
        label: 'Unknown',
        icon: IconCircle,
        color: 'text-muted-foreground'
      };

      return (
        <div className={`flex items-center gap-2 ${status.color || 'text-foreground'}`}>
          <status.icon className="h-4 w-4" />
          <span className="font-medium">{status.label}</span>
        </div>
      );
    } catch (error) {
      console.error('Error rendering status:', error);
      return <span className="text-red-500">Error</span>;
    }
  },
},

  {
    accessorKey: 'submittedBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted By" />
    ),
    cell: ({ row }) => <span>{row.getValue('submittedBy')}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
