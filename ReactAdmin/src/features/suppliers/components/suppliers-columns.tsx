import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Supplier } from '../data/supplierSchema';
import { SuppliersRowActions } from './suppliers-row-actions';

export const supplierColumns: ColumnDef<Supplier>[] = [
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
    meta: {
      className: cn(
        'sticky left-0 z-10 rounded-tl bg-background transition-colors duration-200',
        'group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
  },
  {
    accessorKey: 'name',
    header: () => <span>Name</span>,
    cell: ({ row }) => (
      <div className="max-w-[200px]">{row.getValue('name')}</div>
    ),
    meta: {
      className: cn(
        'bg-background transition-colors duration-200',
        'group-hover/row:bg-muted'
      ),
    },
  },
  {
    accessorKey: 'email',
    header: () => <span>Email</span>,
    cell: ({ row }) => (
      <div className="max-w-[200px]">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: () => <span>Phone</span>,
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'address',
    header: () => <span>Address</span>,
    cell: ({ row }) => <div>{row.getValue('address')}</div>,
  },
  {
    accessorKey: 'company',
    header: () => <span>Company</span>,
    cell: ({ row }) => <div>{row.getValue('company')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: () => <span>Created At</span>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <SuppliersRowActions row={row} />,
  },
];
