import { TopNav } from '@/components/layout/top-nav';
import { Header } from '@/components/layout/header';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { DashboardMetrics} from './components/dashboard';
import { ReportProvider } from '@/features/reports/context/reports-context';

export default function Dashboard() {

 return (
    <ReportProvider>
      <Header>
        {/* Header content */}
        <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      </Header>
      <DashboardMetrics />
    </ReportProvider>
  );
}


const topNav = [
  {
    title: 'Overview',
    href: '/',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: '/customers',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Products',
    href: '/products',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
