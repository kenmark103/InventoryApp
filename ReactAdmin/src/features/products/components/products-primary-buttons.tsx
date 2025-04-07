import { IconDownload, IconPlus, IconPrinter } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '../context/products-context';

export function ProductsPrimaryButtons() {
  const { setOpen } = useProducts();
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen('create')}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => window.print()}
      >
        <span>Print</span> <IconPrinter size={18} />
      </Button>
    </div>
  );
}
