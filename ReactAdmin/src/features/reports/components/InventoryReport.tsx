'use client';
import React, { useState } from 'react';
import { useReports } from '../context/reports-context';
import { InventoryReportDto } from '../data/reports-schema';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors = {
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-yellow-100 text-yellow-800',
  'Out of Stock': 'bg-red-100 text-red-800',
};

export default function InventoryReport() {
  const { fetchInventoryReport, loading, error } = useReports();
  const [report, setReport] = useState<InventoryReportDto | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);

  const loadReport = async () => {
    try {
      const data = await fetchInventoryReport({ includeInactive });
      setReport(data);
    } catch {
      setReport(null);
    }
  };

    return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Report</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="includeInactive"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="includeInactive" className="text-sm text-gray-700">
                Include out-of-stock items
              </label>
            </div>
            
            <button
              onClick={loadReport}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center"
            >
              {loading ? (
                <>
                  <span className="animate-spin">🌀</span>
                  Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Placeholder/Empty State */}
        {!report && !loading && (
          <div className="p-12 text-center text-gray-500">
            <div className="mb-4 text-3xl">📦</div>
            <p className="text-lg font-medium">No report generated yet</p>
            <p className="text-sm mt-2">Click "Generate Report" to view inventory status</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg bg-gray-100" />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-gray-100 rounded-lg" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {/* Report Content */}
        {report && (
          <>
            {/* Summary Cards */}
            <div className="p-6 border-b border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-blue-700">Total Value</h3>
                  <p className="text-2xl font-semibold text-blue-900 mt-2">
                    {formatCurrency(report.totalInventoryValue)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-sm font-medium text-green-700">Items Tracked</h3>
                  <p className="text-2xl font-semibold text-green-900 mt-2">
                    {report.totalStockItems}
                  </p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="text-sm font-medium text-amber-700">Low Stock</h3>
                  <p className="text-2xl font-semibold text-amber-900 mt-2">
                    {report.lowStockItems}
                  </p>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Product', 'SKU', 'Stock', 'Status', 'Last Stocked', 'Value'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${statusColors[item.status]} px-3 py-1.5 text-xs font-medium`}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(item.lastStocked, 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                        {formatCurrency(item.totalValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border-t border-red-100">
            <div className="text-red-700 font-medium flex items-center gap-2">
              <span>⚠️</span>
              Error generating report: {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}