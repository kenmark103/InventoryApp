import { useSuppliers } from '../context/suppliers-context';
import { SuppliersActionDialog } from './SuppliersActionDialog';
import { SuppliersDeleteDialog } from './SuppliersDeleteDialog';

export function SuppliersDialogs() {
  const { open, setOpen, currentSupplier, setCurrentSupplier } = useSuppliers();

  return (
    <>
      <SuppliersActionDialog
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentSupplier && (
        <>
          <SuppliersActionDialog
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentSupplier(null), 500);
            }}
            currentSupplier={currentSupplier}
          />

          <SuppliersDeleteDialog
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => setCurrentSupplier(null), 500);
            }}
            currentSupplier={currentSupplier}
          />
        </>
      )}
    </>
  );
}
