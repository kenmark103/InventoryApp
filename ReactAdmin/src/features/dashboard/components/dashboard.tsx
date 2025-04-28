import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Main } from '@/components/layout/main';
import { Overview } from './overview';
import { RecentSales } from './recent-sales';
import { useReports } from '@/features/reports/context/reports-context';
import { useQuery } from '@tanstack/react-query';
import { format, formatISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardMetrics() {

  const { fetchDashboardMetrics, fetchSales } = useReports();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => fetchDashboardMetrics()
  });

const { data: recentSales, isLoading: salesLoading } = useQuery({
  queryKey: ['recent-sales', 'last-month'],
  queryFn: () => {
    const endDate = new Date();
    const startDate = subMonths(endDate, 1);

    return fetchSales(
      startDate,
      endDate
    );
  }
});

if (metricsLoading || salesLoading) return (
  <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
      <Skeleton className="h-[350px] lg:col-span-4" />
      <Skeleton className="h-[350px] lg:col-span-3" />
    </div>
  </div>
);

  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <div className='flex items-center space-x-2'>
          <Button>Download</Button>
        </div>
      </div>
      
      <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
        <div className='w-full overflow-x-auto pb-2'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='analytics' disabled>Analytics</TabsTrigger>
            <TabsTrigger value='reports' disabled>Reports</TabsTrigger>
            <TabsTrigger value='notifications' disabled>Notifications</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <MetricCard
              title="Total Revenue"
              value={metrics?.totalRevenue}
              change={metrics?.trends?.revenue}
              icon={<CurrencyIcon />}
            />
            <MetricCard
              title="Total Purchases"
              value={metrics?.totalPurchases}
              change={metrics?.trends?.purchases}
              icon={<PurchasesIcon />}
            />
            <MetricCard
              title="Transactions"
              value={metrics?.monthlySales}
              change={metrics?.trends?.sales}
              icon={<SalesIcon />}
            />
            <MetricCard
              title="Total Expenses"
              value={metrics?.totalExpenses}
              change={metrics?.trends?.expenses}
              icon={<ExpenseIcon />}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className='pl-2'>
                <Overview />
              </CardContent>
            </Card>
            
            <Card className='col-span-1 lg:col-span-3'>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  {recentSales?.length 
                    ? `${recentSales.length} recent transactions`
                    : 'No recent transactions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  )
}

const MetricCard = ({ title, value, change, icon }: { 
  title: string
  value?: number
  change?: number
  icon: React.ReactNode
}) => (
  <Card>
    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
      <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-bold'>
        {typeof value === 'number' ? (
          title.startsWith('$') ? `$${value.toLocaleString()}` : value.toLocaleString()
        ) : 'N/A'}
      </div>
      <TrendBadge change={change} />
    </CardContent>
  </Card>
)

const TrendBadge = ({ change }: { change?: number }) => {
  if (typeof change !== 'number') return null
  
  return (
    <p className='text-xs text-muted-foreground'>
      <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
        {change > 0 ? '+' : ''}{change.toFixed(1)}%
      </span>{' '}
      from last month
    </p>
  )
}

// SVG Icons
const CurrencyIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'
    strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-green-500'>
    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
  </svg>
)

const UsersIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'
    strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
    <circle cx='9' cy='7' r='4' />
    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
  </svg>
)

const PurchasesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
       stroke="currentColor" className="h-5 w-5 text-purple-500">
    <path d="M20 7h-5a2 2 0 0 0-2 2v2m0 0h8m-8 0H4m12 6v6m-6-6v6m-6-6v6"/>
    <circle cx="6" cy="7" r="3"/>
    <circle cx="18" cy="7" r="3"/>
  </svg>
)

const SalesIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'
    strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
    <rect width='20' height='14' x='2' y='5' rx='2' />
    <path d='M2 10h20' />
  </svg>
)

const ExpenseIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'
    strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-red-500'>
    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
  </svg>
)