// Products.tsx
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProductsProvider } from '../context/products-context';
import StockManagementPage from './stock-management-page';

export default function StockManagement() {
  return (
    <ProductsProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center gap-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-4 space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Stock Management</h2>
          <p className="text-muted-foreground">
            View, search, and update product stock levels
          </p>
        </div>

        <div className="h-[calc(100vh-140px)] overflow-auto py-2">
          <StockManagementPage />
        </div>
      </Main>
    </ProductsProvider>
  );
}