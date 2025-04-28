'use client';
import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { ReportProvider } from '../context/reports-context';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ReportExport from '../components/ReportExport';

export default function ReportsLayout({ children, }: { children: React.ReactNode }) {
  
  const navigate = useNavigate();

  return (
    <ReportProvider>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ReportExport reportType="expenses" />
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
        <div className="space-y-4">
          {children}
        </div>
      </Main>
    </ReportProvider>
  );
}
