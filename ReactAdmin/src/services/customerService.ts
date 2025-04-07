/* eslint-disable @typescript-eslint/no-explicit-any */
// customerService.ts
import api from '../lib/api'; // your Axios or fetch instance

const getAllCustomers = async () => {
  const response = await api.get('/customers');
  return response.data;
};

const getCustomerById = async (id: number) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

const createCustomer = async (newCustomerData: any) => {
  const response = await api.post('/customers', newCustomerData);
  return response.data;
};

const updateCustomer = async (id: number, updatedData: any) => {
  await api.put(`/customers/${id}`, updatedData);
};

const deleteCustomer = async (id: number) => {
  await api.delete(`/customers/${id}`);
};

export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
