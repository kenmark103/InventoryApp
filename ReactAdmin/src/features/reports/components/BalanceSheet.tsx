// app/reports/balance-sheet/page.tsx
'use client';
import { useReports } from '../context/reports-context';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BalanceSheet() {
  const { fetchBalanceSheet, loading, error } = useReports();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchBalanceSheet()
      .then(data => setReport(data))
      .catch(() => setReport(null));
  }, [fetchBalanceSheet]);

  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Balance Sheet</h1>
      
      {report ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets Section */}
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64">
                <Doughnut 
                  data={{
                    labels: ['Cash', 'Inventory', 'Other Assets'],
                    datasets: [{
                      data: [
                        report.cashBalance,
                        report.inventoryValue,
                        report.otherAssets || 0
                      ],
                      backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#9E9E9E'
                      ]
                    }]
                  }}
                />
              </div>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Cash</TableCell>
                    <TableCell className="text-right">${report.cashBalance.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Inventory</TableCell>
                    <TableCell className="text-right">${report.inventoryValue.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Other Assets</TableCell>
                    <TableCell className="text-right">${(report.otherAssets || 0).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Total Assets</TableCell>
                    <TableCell className="text-right">
                      ${(
                        report.cashBalance + 
                        report.inventoryValue + 
                        (report.otherAssets || 0)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Liabilities & Equity Section */}
          <Card>
            <CardHeader>
              <CardTitle>Liabilities & Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Accounts Payable</TableCell>
                    <TableCell className="text-right">${report.accountsPayable.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Loans</TableCell>
                    <TableCell className="text-right">${(report.loans || 0).toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Retained Earnings</TableCell>
                    <TableCell className="text-right">${report.retainedEarnings.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell>Total Liabilities & Equity</TableCell>
                    <TableCell className="text-right">
                      ${(
                        report.accountsPayable + 
                        (report.loans || 0) + 
                        report.retainedEarnings
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <p>No balance sheet data available.</p>
      )}
    </div>
  );
}