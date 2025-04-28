// app/reports/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useReports } from '../context/reports-context';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Wallet, Warehouse } from 'lucide-react';

const reportCategories = [
  {
    title: "Accounting Reports",
    items: [
      { name: "General Ledger", path: "accounting" },
      { name: "Trial Balance", path: "accounting" },
    ]
  },
  {
    title: "Financial Statements",
    items: [
      { name: "Profit & Loss", path: "profit-loss" },
      { name: "Cash Flow", path: "cash-flow" },
      { name: "Balance Sheet", path: "balance-sheet" },
    ]
  },
  {
    title: "Operational Reports",
    items: [
      { name: "Inventory Report", path: "inventory" },
      { name: "Sales Analytics", path: "sales-report" },
      { name: "Expense Breakdown", path: "expenses" },
    ]
  }
];

export default function ReportsIndex() {
  const navigate = useNavigate();
  const { fetchSales, fetchExpenses, fetchBalanceSheet } = useReports();
  const [metrics, setMetrics] = useState<{
    totalSales?: number;
    totalExpenses?: number;
    cashBalance?: number;
    inventoryValue?: number;
  }>({});
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const loadMetrics = async () => {
        try {
            const [sales, expenses, balanceSheet] = await Promise.all([
                fetchSales(),
                fetchExpenses(),
                fetchBalanceSheet()
            ]);
            
            setMetrics({
                totalSales: sales.reduce((sum, s) => sum + s.total, 0),
                totalExpenses: expenses.reduce((sum, e) => sum + (e.amount + e.taxAmount), 0),
                cashBalance: balanceSheet.cashBalance,
                inventoryValue: balanceSheet.inventoryValue
            });
        } catch (error) {
            console.error("Failed to load metrics:", error);
        } finally {
            setLoading(false);
        }
    };

    loadMetrics();
}, []);

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Cash"
            value={metrics.cashBalance}
            icon={<Wallet className="h-4 w-4" />}
            loading={loading}
          />
          <MetricCard
            title="Inventory Value"
            value={metrics.inventoryValue}
            icon={<Warehouse className="h-4 w-4" />}
            loading={loading}
          />
          <MetricCard
            title="Total Sales"
            value={metrics.totalSales}
            icon={<ArrowUp className="h-4 w-4 text-green-500" />}
            loading={loading}
          />
          <MetricCard
            title="Total Expenses"
            value={metrics.totalExpenses}
            icon={<ArrowDown className="h-4 w-4 text-red-500" />}
            loading={loading}
          />
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {category.items.map((item) => (
                  <Button
                    key={item.name}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate({ to: `/reports/${item.path}` })}
                  >
                    {item.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}

function MetricCard({ title, value, icon, loading }: { 
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <span className="text-sm text-muted-foreground">{title}</span>
          {loading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <div className="text-xl font-semibold">
              ${value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00'}
            </div>
          )}
        </div>
        <div className="p-2 rounded-full bg-muted">{icon}</div>
      </CardContent>
    </Card>
  );
}