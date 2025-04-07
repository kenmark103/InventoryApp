// Products.tsx
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/products-columns'; // Define your product table columns
import { ProductsDialogs } from './components/products-dialogs';
import { ProductsPrimaryButtons } from './components/products-primary-buttons';
import { ProductsTable } from './components/products-table';
import {ProductsProvider} from './context/products-context';

export default function Products() {
  return (
    <ProductsProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">Products List</h2>
            <p className="text-muted-foreground">Manage your products here.</p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <ProductsTable columns={columns} />
        </div>
      </Main>
      <ProductsDialogs />
    </ProductsProvider>
  );
}
