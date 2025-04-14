// Purchases.tsx
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { purchaseColumns } from './components/purchase-columns';
import { PurchasesDialog } from './components/purchase-dialogs';
import { PurchasesPrimaryButtons } from './components/purchases-primary-buttons';
import { PurchasesTable } from './components/purchases-table';
import { PurchasesProvider } from './context/purchases-context';
import { ProductsProvider } from '@/features/products/context/products-context';
import  SuppliersProvider  from "@/features/suppliers/context/suppliers-context";

export default function Purchases() {
  return (
    <ProductsProvider >
        <SuppliersProvider >
          <PurchasesProvider>
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
                  <h2 className="text-2xl font-bold tracking-tight">Purchase History</h2>
                  <p className="text-muted-foreground">Manage your inventory purchases</p>
                </div>
                <PurchasesPrimaryButtons />
              </div>
              <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <PurchasesTable columns={purchaseColumns} />
              </div>
            </Main>
            <PurchasesDialog />
          </PurchasesProvider>
        </SuppliersProvider>
    </ProductsProvider>
  );
}