// features/expenses/components/approve-dialogs.tsx
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useApproveExpenses } from '../context/approve-expenses-context';
import expenseService from '@/services/expenseService';
import { toast } from '@/hooks/use-toast';

export function ApproveDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, refreshExpenses } = useApproveExpenses();

  return (
    <>
      {currentRow && (
        <ConfirmDialog
          open={open === 'reject'}
          onOpenChange={(open) => {
            setOpen(open ? 'reject' : null);
            if (!open) setTimeout(() => setCurrentRow(null), 500);
          }}
          title={`Reject Expense ${currentRow.id}?`}
          desc="This action cannot be undone."
          confirmText="Reject"
          destructive
          handleConfirm={async () => {
            try {
              await expenseService.approveExpense(currentRow.id, 'Rejected');
              await refreshExpenses();
              toast({ title: 'Expense rejected successfully' });
            } catch (error) {
              toast({ title: 'Error rejecting expense', variant: 'destructive' });
            }
          }}
        />
      )}
    </>
  );
}