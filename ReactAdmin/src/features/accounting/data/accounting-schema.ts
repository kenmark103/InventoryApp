type Transaction = {
  id: number;
  date: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
};

type TrialBalance = {
  asOf: string;
  balances: Record<string, number>;
};

interface IAccountingContext {
  ledger: Transaction[];
  trialBalance?: TrialBalance;
  fetchLedger: (start: string, end: string) => Promise<void>;
  fetchTrialBalance: (asOf: string) => Promise<void>;
}