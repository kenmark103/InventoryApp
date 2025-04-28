// src/components/stock-adjustment-history.tsx
import React, { useState, useEffect } from 'react';
import productService from '@/services/productService';
import { format } from 'date-fns-tz';

interface HistoryItem {
  id: number;
  date: string;
  adjustmentAmount: number;
  reason: string;
  notes?: string;
}

interface StockAdjustmentHistoryProps {
  productId: number;
}

export const StockAdjustmentHistory: React.FC<StockAdjustmentHistoryProps> = ({ productId }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const data = await productService.getAdjustmentHistory(productId);
      setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [productId]);

  console.log(history);

  if (loading) return <p className="mt-4 text-gray-600">Loading history…</p>;
  if (!history.length) return <p className="mt-4 text-gray-600">No adjustments yet.</p>;

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
            <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Change</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Reason</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Adjusted by</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Notes</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map(item => (
            <tr key={item.id}>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                {format(new Date(item.date), 'dd/MM/yyyy HH:mm', {
                  timeZone: 'Africa/Nairobi'
                })}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-600">
                {item.adjustmentAmount > 0 ? '+' : ''}{item.adjustmentAmount}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{item.reason}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{item.adjustedBy}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{item.notes || '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
