// app/sales/page.tsx
'use client';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProductSelectionPanel } from './components/ProductSelectionPanel';
import { SalesTable } from './components/SalesTable';
import { CustomerSelector } from './components/CustomerSelector';
import { SalesFloatingToolbar } from './components/SalesFloatingToolbar';
import { PaymentSection } from './components/PaymentSection';
import { ReceiptPrint } from './components/ReceiptPrint';
import { SalesProvider } from './context/sales-context';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { ProductsProvider } from "@/features/products/context/products-context";
import  CategoriesProvider from "@/features/categories/context/categories-context";


export default function Sales() {
  return (
    <SalesProvider>
      <ProductsProvider>
        <CategoriesProvider>
          <Header fixed>
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Sales Terminal</h1>
              {/* Product search remains in header */}
              <Search placeholder="Search products..." /> 
            </div>
            <div className="ml-auto flex items-center gap-4">
              {/* Customer selection moved here */}
              <CustomerSelector />
              <SalesFloatingToolbar />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>

          <Main className="flex h-[calc(100vh-4rem)]">
            {/* Left Panel - Product Selection */}
            <ProductSelectionPanel />

            {/* Right Panel - Current Sale */}
            <div className="flex-1 flex flex-col">
              {/* Sales Items Table */}
              <div className="flex-1 overflow-y-auto p-4">
                <SalesTable />
              </div>

              {/* Payment Section */}
              <PaymentSection />
            </div>
          </Main>

          <ReceiptPrint />
        </CategoriesProvider>
      </ProductsProvider>
    </SalesProvider>
  );
}