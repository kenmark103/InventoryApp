// features/expenses/components/approve-row-actions.tsx
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useApproveExpenses } from '../context/approve-expenses-context';
import { expenseSchema } from '../data/expense-schema';
import expenseService from '@/services/expenseService';
import { toast } from '@/hooks/use-toast';

export function ApproveRowActions<TData>({ row }: { row: Row<TData> }) {
  const expense = expenseSchema.parse(row.original);
  const { refreshExpenses, setCurrentRow, setOpen } = useApproveExpenses();

  const handleStatusUpdate = async (status: string) => {
    try {
      await expenseService.approveExpense(expense.id, status);
      await refreshExpenses();
      toast({ title: `Expense ${status} successfully` });
    } catch (error) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleStatusUpdate('Approved')}>Approve</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setCurrentRow(expense);
          setOpen('reject');
        }}>Reject</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusUpdate('Paid')}>Mark Paid</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}