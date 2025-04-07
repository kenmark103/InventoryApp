import { toast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useExpenses } from '../context/expenses-context';
import { ExpensesImportDialog } from './expenses-import-dialog';
import { ExpensesMutateDrawer } from './expenses-mutate-drawer';

export function ExpensesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExpenses();

  return (
    <>
      <ExpensesMutateDrawer
        key="expense-create"
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <ExpensesImportDialog
        key="expenses-import"
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <ExpensesMutateDrawer
            key={`expense-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key="expense-delete"
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={() => {
              setOpen(null);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
              toast({
                title: 'Expense deleted successfully',
                description: (
                  <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                      {JSON.stringify(currentRow, null, 2)}
                    </code>
                  </pre>
                ),
              });
            }}
            className="max-w-md"
            title={`Delete this expense: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete an expense with the ID <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText="Delete"
          />
        </>
      )}
    </>
  );
}
