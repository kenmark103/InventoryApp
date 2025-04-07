
'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProducts } from '../context/products-context';
import { productSchema } from '../data/products-schema';
import { z } from 'zod';

interface ProductsRowActionsProps<TData> {
  row: Row<TData>;
}

export function ProductsRowActions<TData>({ row }: ProductsRowActionsProps<TData>) {
  // Parse the row as a Product using your product schema.
  //const product = productSchema.parse(row.original);
  
  const result = productSchema.safeParse(row.original);
if (!result.success) {
  console.error(result.error);
} else {
  const product = result.data;
 
}
  

  const { setOpen, setCurrentProduct } = useProducts();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            setCurrentProduct(product);
            setOpen('edit');
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
        <DropdownMenuItem disabled>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentProduct(product);
            setOpen('delete');
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
