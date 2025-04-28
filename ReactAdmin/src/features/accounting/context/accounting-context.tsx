import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {Transaction, TrialBalance, IAccountingContext} from '../data/accounting-schema'


const AccountingContext = createContext<IAccountingContext | undefined>(undefined);

export const AccountingProvider: React.FC = ({ children }) => {
  const [ledger, setLedger] = useState<Transaction[]>([]);
  const [trialBalance, setTrialBalance] = useState<TrialBalance>();

  const fetchLedger = async (start: string, end: string) => {
    const resp = await axios.get<Transaction[]>(`/api/accounting/ledger`, { params: { start, end } });
    setLedger(resp.data);
  };

  const fetchTrialBalance = async (asOf: string) => {
    const resp = await axios.get<TrialBalance>(`/api/accounting/trial-balance`, { params: { asOf } });
    setTrialBalance(resp.data);
  };

  return (
    <AccountingContext.Provider value={{ ledger, trialBalance, fetchLedger, fetchTrialBalance }}>
      {children}
    </AccountingContext.Provider>
  );
};

export const useAccounting = () => {
  const ctx = useContext(AccountingContext);
  if (!ctx) throw new Error("useAccounting must be used within AccountingProvider");
  return ctx;
};
