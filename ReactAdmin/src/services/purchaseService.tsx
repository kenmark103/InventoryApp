/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../lib/api';
import { Purchase } from '../data/purchase-schema';

const getAllPurchases = async () => {
  const response = await api.get<Purchase[]>('/purchase');
  return response.data;
};

const getPurchaseById = async (id: number) => {
  const response = await api.get<Purchase>(`/purchase/${id}`);
  return response.data;
};

const createPurchase = async (newPurchaseData: Omit<Purchase, 'id'>) => {
  const response = await api.post<Purchase>('/purchase', newPurchaseData);
  return response.data;
};

const updatePurchase = async (id: number, updatedData: Partial<Purchase>) => {
  await api.put(`/purchase/${id}`, updatedData);
};

const deletePurchase = async (id: number) => {
  await api.delete(`/purchase/${id}`);
};

export default {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
};