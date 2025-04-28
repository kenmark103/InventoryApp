import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { ExpensesDialogs } from './components/expenses-dialogs'
import { ExpensesPrimaryButtons } from './components/expenses-primary-buttons'
import { ExpensesProvider } from './context/expenses-context'
import { useExpenses } from './context/expenses-context';
import * as React from 'react';
import  SuppliersProvider from '@/features/suppliers/context/suppliers-context';

export default function Expenses() {
  return (
  <SuppliersProvider>
    <ExpensesProvider>
      <PageLayout />
    </ExpensesProvider>
  </SuppliersProvider>
  );
}

function PageLayout() {
  const { expenses, loading } = useExpenses();

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Expenses</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your Expenses for this month!
            </p>
          </div>
          <ExpensesPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable 
            columns={columns} 
            data={expenses || []} 
            loading={loading} 
          />
        </div>
      </Main>

      <ExpensesDialogs />
    </>
  );
}