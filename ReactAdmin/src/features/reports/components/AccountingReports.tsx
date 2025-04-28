'use client';
import React, { useState } from 'react';
import { useReports } from '../context/reports-context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AccountingReports() {
  const { fetchLedger, fetchTrialBalance, loading, error } = useReports();
  const [ledger, setLedger] = useState<any[]>([]);
  const [trialBalance, setTrialBalance] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [asOfDate, setAsOfDate] = useState(new Date());

  const loadLedger = async () => {
    try {
      const data = await fetchLedger(dateRange.start, dateRange.end);
      setLedger(Array.isArray(data) ? data : []);
    } catch {
      setLedger([]);
    }
  };

  const loadTrial = async () => {
    try {
      const data = await fetchTrialBalance(asOfDate);
      setTrialBalance(Array.isArray(data) ? data : []);
    } catch {
      setTrialBalance([]);
    }
  };

  // Format currency values
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(value);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* General Ledger Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">General Ledger</h2>
            <p className="text-gray-500 mt-1">
              Transactions from {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <div className="flex gap-2 items-center">
              <DatePicker
                selected={dateRange.start}
                onChange={(d: Date) => setDateRange(prev => ({ ...prev, start: d }))}
                selectsStart
                className="w-full p-2 border rounded-md"
                dateFormat="MMM dd, yyyy"
              />
              <span className="text-gray-500">to</span>
              <DatePicker
                selected={dateRange.end}
                onChange={(d: Date) => setDateRange(prev => ({ ...prev, end: d }))}
                selectsEnd
                minDate={dateRange.start}
                className="w-full p-2 border rounded-md"
                dateFormat="MMM dd, yyyy"
              />
            </div>
            <button 
              onClick={loadLedger} 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {loading ? 'Loading...' : 'Refresh Ledger'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ledger.length > 0 ? ledger.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {entry.account}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {entry.debit ? formatCurrency(entry.debit) : '-'}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {entry.credit ? formatCurrency(entry.credit) : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    {loading ? 'Loading ledger entries...' : 'No transactions found in selected period'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Trial Balance Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trial Balance</h2>
            <p className="text-gray-500 mt-1">
              As of {asOfDate.toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-4 mt-4 sm:mt-0">
            <DatePicker
              selected={asOfDate}
              onChange={(d: Date) => setAsOfDate(d)}
              className="w-full p-2 border rounded-md"
              dateFormat="MMM dd, yyyy"
            />
            <button 
              onClick={loadTrial} 
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              {loading ? 'Loading...' : 'Update Balance'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Account</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Debit Balance</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Credit Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trialBalance.length > 0 ? trialBalance.map(account => (
                <tr key={account.account} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {account.account}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {formatCurrency(account.debitBalance)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-700">
                    {formatCurrency(account.creditBalance)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-500">
                    {loading ? 'Loading trial balance...' : 'No trial balance data available'}
                  </td>
                </tr>
              )}
            </tbody>
            {trialBalance.length > 0 && (
              <tfoot className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Totals</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    {formatCurrency(trialBalance.reduce((sum, acc) => sum + acc.debitBalance, 0))}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    {formatCurrency(trialBalance.reduce((sum, acc) => sum + acc.creditBalance, 0))}
                  </th>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </section>
    </div>
  );
}