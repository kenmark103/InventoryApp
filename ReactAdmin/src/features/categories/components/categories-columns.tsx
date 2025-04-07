import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Category } from '../data/categorySchema';
import { CategoriesRowActions } from './categoriesRowActions';

export const columns: ColumnDef<Category>[] = [
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
    cell: ({ row }) => <div className="max-w-[200px]">{row.getValue('name')}</div>,
    meta: {
      className: cn(
        'bg-background transition-colors duration-200',
        'group-hover/row:bg-muted'
      ),
    },
  },
  {
    accessorKey: 'status',
    header: () => <span>Status</span>,
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'parentId',
    header: () => <span>Parent Category</span>,
    cell: ({ row }) => <div>{row.getValue('parentId')}</div>,
  },
  {
    // "products" column to show total number of products in this category.
    // This field should be available in your category object, either directly or via a virtual.
    accessorKey: 'productCount',
    header: () => <span>Products</span>,
    cell: ({ row }) => <div>{row.getValue('productCount')}</div>,
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
    cell: ({ row }) => <CategoriesRowActions row={row} />,
  },
];
