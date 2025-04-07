
import { useProducts } from '../context/products-context';
import { ProductsDeleteDialog } from './products-delete-dialog';
import { AddProduct } from './products-add';
import { EditProduct } from './product-edit';

export function ProductsDialogs() {
  const { open, setOpen, currentProduct, setCurrentProduct } = useProducts();

  return (
    <>
      <AddProduct
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentProduct && (
        <>
          <EditProduct
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentProduct(null), 500);
            }}
            currentProduct={currentProduct}
          />

          <ProductsDeleteDialog
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => setCurrentProduct(null), 500);
            }}
            currentProduct={currentProduct}
          />
        </>
      )}
    </>
  );
}
