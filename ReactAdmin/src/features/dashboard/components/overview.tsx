import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useQuery } from '@tanstack/react-query';
import { useReports } from '@/features/reports/context/reports-context';
import { 
  startOfYear, endOfYear, 
  subMonths, startOfMonth, endOfMonth,
  subWeeks, startOfWeek, endOfWeek, 
  format, eachDayOfInterval 
} from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function Overview() {
  const { fetchSales } = useReports();
  const [selectedPeriod, setSelectedPeriod] = useState<'annual' | 'monthly' | 'weekly'>('annual');

  const { data, isLoading } = useQuery({
    queryKey: ['sales', selectedPeriod],
    queryFn: async () => {
      const now = new Date();
      let start: Date, end: Date;

      switch(selectedPeriod) {
        case 'annual':
          start = startOfYear(subMonths(now, 11)); // Last 12 months
          end = endOfYear(now);
          break;
        case 'monthly':
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case 'weekly':
          start = startOfWeek(subWeeks(now, 1)); // Last 7 days
          end = endOfWeek(now);
          break;
        default:
          start = startOfYear(now);
          end = endOfYear(now);
      }

      return fetchSales(start, end);
    }
  });

  const getTimeLabels = () => {
    const now = new Date();
    switch(selectedPeriod) {
      case 'annual':
        return Array.from({ length: 12 }, (_, i) => 
          format(subMonths(now, 11 - i), 'MMM')
        ).reverse();
      case 'monthly':
        return eachDayOfInterval({ 
          start: startOfMonth(now), 
          end: endOfMonth(now) 
        }).map(d => format(d, 'd'));
      case 'weekly':
        return eachDayOfInterval({ 
          start: subWeeks(now, 1), 
          end: now 
        }).map(d => format(d, 'EEE'));
      default:
        return [];
    }
  };

  const timeLabels = getTimeLabels();
  
  const chartData = timeLabels.map(label => {
    const total = data?.reduce((sum, sale) => {
      const saleDate = new Date(sale.saleDate);
      const periodKey = selectedPeriod === 'annual' 
        ? format(saleDate, 'MMM')
        : selectedPeriod === 'monthly'
        ? format(saleDate, 'd')
        : format(saleDate, 'EEE');

      return periodKey === label 
        ? sum + (sale.subtotal + sale.taxAmount - sale.discount)
        : sum;
    }, 0) || 0;

    return { name: label, total: Number(total.toFixed(2)) };
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="annual">Annual</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-muted-foreground text-center py-8">
          No {selectedPeriod} sales data available
        </div>
      )}
    </div>
  );
}