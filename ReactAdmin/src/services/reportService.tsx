// /Services/reports-service.ts
import api from '../lib/api';

const getProfitLossReport = async (startDate: string, endDate: string) => {
  const { data } = await api.get('/reports/profit-loss', { params: { startDate, endDate } });
  return data;
};

const getCashFlowReport = async (startDate: string, endDate: string) => {
  const { data } = await api.get('/reports/cash-flow', { params: { startDate, endDate } });
  return data;
};

const getBalanceSheet = async () => {
  const { data } = await api.get('/reports/balance-sheet');
  return data;
};

const getSalesReport = async (startDate?: string, endDate?: string) => {
  const { data } = await api.get('/reports/sales', {
    params: { startDate, endDate },
  });
  return data;
};

const getRecentSales = async (limit = 5) => {
   console.log('Fetching recent sales with limit:', limit);
  try {
    const response = await api.get('reports/sales', {
      params: { limit }
    });
    console.log('Recent sales response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent sales:', error);
    throw error;
  }
};

const getDashboardMetrics = async() => {
  const { data} = await api.get('/reports/metrics');
  return data;
};

const getInventoryReport = async (  includeInactive?: boolean,  lowStockThreshold = 10) => {
  const { data } = await api.get('/reports/inventory', {
    params: { includeInactive, lowStockThreshold }
  });
  return data;
};

const getExpensesReport = async (startDate?: string, endDate?: string) => {
  const { data } = await api.get('/reports/expenses', {
    params: { startDate, endDate },
  });
  return data;
};


const exportReport = async ( format: 'pdf' | 'excel',  startDate?: string,  endDate?: string,  reportType?: string) => {
  const { data } = await api.get('/reports/export', {
    params: { format, startDate, endDate, reportType },
    responseType: 'blob',
  });
  return data;
};

const reportService = {
  getProfitLossReport,
  getCashFlowReport,
  getBalanceSheet,
  getSalesReport,
  getExpensesReport,
  exportReport,
  getDashboardMetrics,
  getRecentSales,
  getInventoryReport,
};

export default reportService;
