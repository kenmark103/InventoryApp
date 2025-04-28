'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useReports } from '../context/reports-context';
import DatePicker from 'react-datepicker';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { format, subDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

ChartJS.register(...registerables);

interface ProfitLossData {
  totalRevenue: number;
  costOfGoodsSold: number;
  totalExpenses: number;
  revenueByProduct: Record<string, number>;
  expenseByCategory: Record<string, number>;
  startDate: string;
  endDate: string;
}

export default function ProfitLossReport() {
  const { fetchProfitLoss, loading, error } = useReports();
  const [report, setReport] = useState<ProfitLossData | null>(null);
  const [dates, setDates] = useState({ 
    start: subDays(new Date(), 30), 
    end: new Date() 
  });
  const barChartRef = useRef<ChartJS<'bar'>>(null);
  const pieChartRef = useRef<ChartJS<'pie'>>(null);

  // Chart cleanup
  useEffect(() => {
    return () => {
      barChartRef.current?.destroy();
      pieChartRef.current?.destroy();
    };
  }, []);

  const loadReport = async () => {
    if (dates.end < dates.start) {
      alert('End date cannot be before start date');
      return;
    }

    try {
      
      if (barChartRef.current) barChartRef.current.destroy();
      if (pieChartRef.current) pieChartRef.current.destroy();

      const data = await fetchProfitLoss(dates.start, dates.end);
      setReport(data);
    } catch {
      setReport(null);
    }
  };

  
  const revenueData = {
    labels: report?.revenueByProduct ? Object.keys(report.revenueByProduct) : [],
    datasets: [{
      label: 'Revenue by Product',
      data: report ? Object.values(report.revenueByProduct) : [],
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const expenseData = {
    labels: report?.expenseByCategory ? Object.keys(report.expenseByCategory) : [],
    datasets: [{
      label: 'Expenses by Category',
      data: report ? Object.values(report.expenseByCategory) : [],
      backgroundColor: [
        '#F59E0B', '#EF4444', '#10B981', '#6366F1', '#8B5CF6'
      ],
      borderWidth: 0,
    }]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profit & Loss Statement</h1>
        <p className="text-gray-500 mt-2">
          Financial overview between {report ? 
          `${format(new Date(report.startDate), 'MMM dd, yyyy')} - ${format(new Date(report.endDate), 'MMM dd, yyyy')}` : 
          'selected dates'}
        </p>
      </div>

      {/* Date Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <DatePicker
                selected={dates.start}
                onChange={(date: Date) => setDates(prev => ({ ...prev, start: date }))}
                selectsStart
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dateFormat="MMM dd, yyyy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <DatePicker
                selected={dates.end}
                onChange={(date: Date) => setDates(prev => ({ ...prev, end: date }))}
                selectsEnd
                minDate={dates.start}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dateFormat="MMM dd, yyyy"
              />
            </div>
          </div>
          <button
            onClick={loadReport}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                Generating...
              </>
            ) : 'Generate Report'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Content Area */}
      {loading ? (
        <ReportSkeleton />
      ) : report ? (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label="Total Revenue"
              value={report.totalRevenue}
              type="positive"
            />
            <MetricCard
              label="Cost of Goods Sold"
              value={report.costOfGoodsSold}
              type="negative"
            />
            <MetricCard
              label="Net Profit"
              value={report.totalRevenue - report.costOfGoodsSold - report.totalExpenses}
              type="positive"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="Revenue Breakdown">
              <Bar
                ref={barChartRef}
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${Number(value).toLocaleString()}`
                      }
                    }
                  }
                }}
              />
            </ChartContainer>

            <ChartContainer title="Expense Distribution">
              <Pie
                ref={pieChartRef}
                data={expenseData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          return `${label}: $${value.toLocaleString()}`;
                        }
                      }
                    }
                  }
                }}
              />
            </ChartContainer>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No report generated"
          message="Select a date range and click 'Generate Report' to view financial data"
        />
      )}
    </div>
  );
}

// Helper Components
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const MetricCard = ({ label, value, type }: { 
  label: string; 
  value: number; 
  type: 'positive' | 'negative' 
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className={`mt-2 text-2xl font-semibold ${
      type === 'positive' ? 'text-green-600' : 'text-red-600'
    }`}>
      ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
    </p>
  </div>
);

const ChartContainer = ({ title, children }: { 
  title: string; 
  children: React.ReactNode 
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h4 className="text-lg font-semibold mb-4">{title}</h4>
    <div className="h-80">{children}</div>
  </div>
);

const EmptyState = ({ title, message }: { 
  title: string; 
  message: string 
}) => (
  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>
  </div>
);

const ReportSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-80 bg-gray-100 rounded-lg" />
      ))}
    </div>
  </div>
);