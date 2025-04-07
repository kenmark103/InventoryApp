// CustomersDialogs.tsx
import { useCustomers } from '../context/customers-context';
import { CustomersActionDialog } from './CustomersActionDialog';
import { CustomersDeleteDialog } from './CustomersDeleteDialog';

export function CustomersDialogs() {
  const { open, setOpen, currentCustomer, setCurrentCustomer } = useCustomers();

  return (
    <>
      <CustomersActionDialog
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentCustomer && (
        <>
          <CustomersActionDialog
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentCustomer(null), 500);
            }}
            currentCustomer={currentCustomer}
          />

          <CustomersDeleteDialog
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => setCurrentCustomer(null), 500);
            }}
            currentCustomer={currentCustomer}
          />
        </>
      )}
    </>
  );
}
