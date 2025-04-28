// app/reports/cash-flow/page.tsx
'use client';
import { useReports } from '../context/reports-context';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CashFlow() {
  const { fetchCashFlow, loading, error } = useReports();
  const [cashFlow, setCashFlow] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCashFlow(new Date('2023-01-01'), new Date());
        setCashFlow(data);
      } catch (error) {
        console.error("Failed to load cash flow:", error);
      }
    };
    
    loadData();
  }, [fetchCashFlow]);

  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cash Flow Statement</h1>
      
      {cashFlow ? (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar
                  data={{
                    labels: ['Operating', 'Investing', 'Financing'],
                    datasets: [{
                      label: 'Cash Flow',
                      data: [
                        cashFlow.operatingActivities,
                        cashFlow.investingActivities,
                        cashFlow.financingActivities
                      ],
                      backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800'
                      ]
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Operating Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${cashFlow.operatingActivities?.toFixed(2) ?? '0.00'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Investing Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${cashFlow.investingActivities?.toFixed(2) ?? '0.00'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Financing Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${cashFlow.financingActivities?.toFixed(2) ?? '0.00'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </div>
      ) : (
        <p>No cash flow data available.</p>
      )}
    </div>
  );
}