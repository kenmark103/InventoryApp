// Customers.tsx
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { customerColumns as customerColumns } from './components/customers-columns'; // define your customer table columns
import { CustomersDialogs } from './components/CustomersDialogs';
import { CustomersPrimaryButtons } from './components/CustomersPrimaryButtons';
import { CustomersTable } from './components/CustomersTable';
import CustomersProvider from './context/customers-context';

export default function Customers() {
  return (
    <CustomersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Customer List</h2>
            <p className='text-muted-foreground'>Manage your customers here.</p>
          </div>
          <CustomersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CustomersTable columns={customerColumns} />
        </div>
      </Main>
      <CustomersDialogs />
    </CustomersProvider>
  );
}
