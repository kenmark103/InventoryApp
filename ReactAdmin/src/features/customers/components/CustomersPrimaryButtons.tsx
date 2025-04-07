// CustomersPrimaryButtons.tsx
import { Button } from '@/components/ui/button';
import { useCustomers } from '../context/customers-context';
import { IconUserPlus } from '@tabler/icons-react';

export function CustomersPrimaryButtons() {
  const { setOpen } = useCustomers();
  return (
    <div className='flex gap-2'>
      <Button onClick={() => setOpen('add')} className='space-x-1'>
        <span>Add Customer</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
