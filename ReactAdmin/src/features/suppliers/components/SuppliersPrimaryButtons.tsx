import { Button } from '@/components/ui/button';
import { useSuppliers } from '../context/suppliers-context';
import { IconUserPlus } from '@tabler/icons-react';

export function SuppliersPrimaryButtons() {
  const { setOpen } = useSuppliers();
  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('add')} className='space-x-1'>
        <span>Add Supplier</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
