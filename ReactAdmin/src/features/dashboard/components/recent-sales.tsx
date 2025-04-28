import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from '@tanstack/react-query';
import { useReports } from '@/features/reports/context/reports-context';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentSales() {

  const { fetchRecentSales } = useReports();
  
  const { data, isLoading } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => fetchRecentSales(5) 
  });


if (isLoading) return (
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
    <div className='space-y-8'>
      {data?.map((sale) => (
        <div key={sale.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>
              {sale.customerName?.[0] || 'W'}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>
                {sale.customerName || 'Walk-in Customer'}
              </p>
              <p className='text-sm text-muted-foreground'>
                {sale.invoiceNumber}
              </p>
            </div>
            <div className='font-medium'>
              Kes{sale.total.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
      {!data?.length && <div className='text-center py-4'>No recent sales</div>}
    </div>
  );
}