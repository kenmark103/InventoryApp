// app/sales/page.tsx
'use client';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { SalesProvider } from '@/features/sales/context/sales-context';
import { ReportProvider } from '../context/reports-context';
import SalesReport from '../components/SalesReport';
import ReportExport from '../components/ReportExport';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SalesPage() {

  const navigate = useNavigate();

  return (
    <ReportProvider>
      <SalesProvider>
        <Header fixed>
          <Search />
          <div className="ml-auto flex items-center space-x-4">
            <ReportExport reportType="sales" />
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className="container max-w-7xl mx-auto px-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/reports' })}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Reports
            </Button>
          </div>
          <SalesReport />
        </Main>
      </SalesProvider>
    </ReportProvider>
  );
}