import { useCategories } from '../context/categories-context';
import { CategoriesActionDialog } from './CategoriesActionDialog';
import { CategoriesDeleteDialog } from './CategoriesDeleteDialog'; // assuming you have a delete dialog for categories

export function CategoriesDialogs() {
  const { open, setOpen, currentCategory, setCurrentCategory } = useCategories();

  return (
    <>
      <CategoriesActionDialog
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentCategory && (
        <>
          <CategoriesActionDialog
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentCategory(null), 500);
            }}
            currentCategory={currentCategory}
          />

          <CategoriesDeleteDialog
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => setCurrentCategory(null), 500);
            }}
            currentCategory={currentCategory}
          />
        </>
      )}
    </>
  );
}
