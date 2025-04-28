import api from '../lib/api';
import { Expense, ExpenseCreateForm } from "@/features/expenses/data/expense-schema";

const getExpenses = async () => {
  const response = await api.get<Expense[]>('/expenses');
  return response.data;
};

const getMyExpenses = async () => {
  const response = await api.get<Expense[]>('/expenses/my');
  return response.data;
};

const createExpense = async (formData: FormData) => {
  const response = await api.post<Expense>('/expenses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const getPendingExpenses = async () => {
  const response = await api.get<Expense[]>('/expenses/pending');
  return response.data;
};

const approveExpense = async (id: number, status: string) => {
  await api.put(`/expenses/${id}/approve`, { Status: status });
};

const deleteExpense = async (id: number) => {
  await api.delete(`/expenses/${id}`);
};


const expenseService = {
  getExpenses,
  getMyExpenses,
  createExpense,
  getPendingExpenses,
  approveExpense,
  deleteExpense  
};

export default expenseService;