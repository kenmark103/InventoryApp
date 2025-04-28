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
import CategoriesProvider from "@/features/categories/context/categories-context";

export default function Sales() {
  return (
    <SalesProvider>
      <ProductsProvider>
          {/* Global Header */}
          <Header fixed>
            <div className="flex items-center justify-between w-full">
              <Search placeholder="Search system..." className="max-w-xl" />
              <div className="flex items-center gap-4 ml-auto">
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </div>
          </Header>

          {/* Sales Terminal Header */}
          <div className="pt-16"> {/* Offset for fixed header */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  {/* Sales Terminal Title */}
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Sales Terminal
                  </h1>

                  {/* Sales-Specific Search */}
                  <div className="max-w-md w-full mx-4">
                    <Search 
                      placeholder="Search products..." 
                      className="bg-gray-50 dark:bg-gray-700"
                    />
                  </div>

                  {/* Sales Controls */}
                  <div className="flex items-center gap-4">
                    <SalesFloatingToolbar />
                    <CustomerSelector />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Main className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex flex-1 overflow-hidden">
              {/* Product Selection Panel */}
              <ProductSelectionPanel className="w-1/3 border-r dark:border-gray-700 p-4" />
              
              {/* Sales Workspace */}
              <div className="flex flex-col flex-1 w-2/3 justify-between">
                <div className="flex-1 overflow-y-auto p-4">
                  <SalesTable />
                </div>

                <PaymentSection
                  className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 sticky bottom-0"
                />
              </div>
            </div>
          </Main>

          <ReceiptPrint />
      </ProductsProvider>
    </SalesProvider>
  );
}