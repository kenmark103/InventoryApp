
'use client';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { SalesProvider } from '@/features/sales/context/sales-context';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router'; 
import { SalesOrder } from './salesorder';

export default function SalesOrderPage() {
  return (
    

    <SalesProvider>
      <Header fixed>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-lg font-semibold">Sales Order</h1>
          <div className="flex items-center gap-4">
            <Button asChild 
                onClick={() => {
                  navigate({ to: `/sales` });
                }}
            >
              New Sale
              
            </Button>
          </div>
        </div>
      </Header>
      
      <Main>
        <div className="p-8 bg-gray-50 min-h-screen">
      		<SalesOrder />
    	</div>
      </Main>
    </SalesProvider>
  );
}