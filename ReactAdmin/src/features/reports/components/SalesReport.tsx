'use client';
import React, { useState } from 'react';
import { useReports } from '../context/reports-context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { SaleStatus } from '@/features/sales/data/sales-schema';
import { statusColors } from '@/features/sales/data/sales-constants'

export default function SalesReport() {
  const { fetchSales, loading, error } = useReports();
  const [sales, setSales] = useState<any[]>([]);
  const [dates, setDates] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });


  const paymentIcons = {
    CARD: '💳',
    CASH: '💰',
    TRANSFER: '🏦',
    CREDIT: '📝',
    CRYPTO: '🔗'
  };

  const loadSales = async () => {
    try {
      const data = await fetchSales(dates.start, dates.end);
      setSales(Array.isArray(data) ? data : []);
    } catch {
      setSales([]);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sales Report</h1>
        
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
                className="w-full p-2 border rounded-md"
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
                className="w-full p-2 border rounded-md"
                dateFormat="MMM dd, yyyy"
              />
            </div>
          </div>
          <button
            onClick={loadSales}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-semibold text-green-600">
            KSh{sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Average Sale</h3>
          <p className="text-2xl font-semibold text-blue-600">
            KSh{(sales.reduce((sum, sale) => sum + sale.total, 0) / (sales.length || 1)).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Items Sold</h3>
          <p className="text-2xl font-semibold text-purple-600">
            {sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
          </p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales.map(sale => (
              <React.Fragment key={sale.id}>
                <tr className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {sale.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(sale.saleDate).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                      timeZone: 'Africa/Nairobi'
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {sale.customerName || 'Walk-in Customer'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[sale.status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>{paymentIcons[sale.paymentMethod] || '💳'}</span>
                      {sale.paymentMethod}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    KSh{sale.total.toFixed(2)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            No sales found in the selected date range
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}