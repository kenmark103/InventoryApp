// Suppliers.tsx
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { supplierColumns } from './components/suppliers-columns'; // define your supplier table columns
import { SuppliersDialogs } from './components/SuppliersDialogs';
import { SuppliersPrimaryButtons } from './components/SuppliersPrimaryButtons';
import { SuppliersTable } from './components/SuppliersTable';
import SuppliersProvider from './context/suppliers-context';

export default function Suppliers() {
  return (
    <SuppliersProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Supplier List</h2>
            <p className="text-muted-foreground">Manage your suppliers here.</p>
          </div>
          <SuppliersPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <SuppliersTable columns={supplierColumns} />
        </div>
      </Main>
      <SuppliersDialogs />
    </SuppliersProvider>
  );
}
