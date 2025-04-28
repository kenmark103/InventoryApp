// features/expenses/pages/approve-page.tsx
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { DataTable } from './components/data-table'
import { approveColumns } from './components/approve-columns';
import { ApproveExpensesProvider, useApproveExpenses } from './context/approve-expenses-context';
import { ApproveDialogs } from './components/approve-dialogs';

function PageLayout() {
  const { expenses, loading } = useApproveExpenses();

  return (
    <>
      <Header fixed>
        {/* Header content */}
      </Header>

      <Main>
        <div className="mb-2 space-y-2">
          <h2 className="text-2xl font-bold">Pending Approvals</h2>
          <p className="text-muted-foreground">Review and approve pending expenses</p>
        </div>
        <DataTable
          columns={approveColumns}
          data={expenses}
          loading={loading}
        />
      </Main>
      <ApproveDialogs />
    </>
  );
}

export default function ApprovePage() {
  return (
    <ApproveExpensesProvider>
      <PageLayout />
    </ApproveExpensesProvider>
  );
}