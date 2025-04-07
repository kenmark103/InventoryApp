import { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from '@tanstack/react-router'; // or from '@tanstack/router' if that's what you're using
import { Product } from "@/data/productSchema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ProductsRowActions } from "./products-row-actions";


export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
        "sticky left-0 z-10 rounded-tl bg-background transition-colors duration-200",
        "group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
      ),
    },
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5086';
      const imagePath = row.getValue("imageUrl") as string;
      const fullImageUrl = `${apiUrl}${imagePath}`;

      return (
        <div className="w-16 h-16 overflow-hidden rounded-md border">
          <img
            src={fullImageUrl}
            alt={row.original.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.png';
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const productId = row.original.id;
      return (
        <div
          onClick={() => navigate(`/products/${productId}`)}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          {row.getValue("name")}
        </div>
      );
    },
    meta: {
      className: cn(
        "bg-background transition-colors duration-200",
        "group-hover/row:bg-muted"
      ),
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div>{row.getValue("sku")}</div>,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
    cell: ({ row }) => <div>${row.getValue("sellingPrice")}</div>,
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => <div>{row.getValue("categoryName")}</div>,
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
    cell: ({ row }) => <div>{row.getValue("supplierName")}</div>,
  },
  {
    accessorKey: "inventoryManager",
    header: "added By",
    cell: ({ row }) => <div>{row.getValue("inventoryManager")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductsRowActions row={row} />,
  },
];
