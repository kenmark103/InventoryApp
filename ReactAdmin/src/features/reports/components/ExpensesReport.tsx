'use client';
import React, { useState } from 'react';
import { useReports } from '../context/reports-context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { expenseStatuses, expenseTypes, expensePriorities, statusIcons, priorityIcons } from '@/features/expenses/data/expenseConstants';

export default function ExpensesReport() {
  const { fetchExpenses, loading, error } = useReports();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dates, setDates] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });


  const loadExpenses = async () => {
    try {
      const data = await fetchExpenses(dates.start, dates.end);
      setExpenses(Array.isArray(data) ? data : []);
    } catch {
      setExpenses([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'Kes' 
    }).format(value);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Expenses Report</h1>
        
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
            onClick={loadExpenses}
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
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="text-2xl font-semibold text-red-600">
            {formatCurrency(expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Average Expense</h3>
          <p className="text-2xl font-semibold text-purple-600">
            {formatCurrency(expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0) / (expenses.length || 1))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Pending Approval</h3>
          <p className="text-2xl font-semibold text-yellow-600">
            {expenses.filter(exp => exp.status === 'Pending').length}
          </p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {expense.vendor}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {expense.description}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {expenseTypes.find(t => t.value === expense.label)?.label || 'Other'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(expense.amount + (expense.taxAmount || 0))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {expenses.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            No expenses found in the selected date range
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