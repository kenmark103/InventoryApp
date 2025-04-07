import { Button } from '@/components/ui/button';
import { useCategories } from '../context/categories-context';
import { IconPlus } from '@tabler/icons-react'; // Change icon if desired

export function CategoriesPrimaryButtons() {
  const { setOpen } = useCategories();
  return (
    <div className="flex gap-2">
      <Button onClick={() => setOpen('add')} className="space-x-1">
        <span>Add Category</span> <IconPlus size={18} />
      </Button>
    </div>
  );
}
