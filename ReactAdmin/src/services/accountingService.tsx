import api from '../lib/api';

const getGeneralLedger = async (startDate: string, endDate: string) => {
  const response = await api.get('/accounting/ledger', {
    params: { start: startDate, end: endDate }
  });
  return response.data;
};

const getTrialBalance = async (asOfDate: string) => {
  const response = await api.get('/accounting/trial-balance', {
    params: { asOf: asOfDate }
  });
  return response.data;
};

const accountingService = {
  getGeneralLedger,
  getTrialBalance
};

export default accountingService;