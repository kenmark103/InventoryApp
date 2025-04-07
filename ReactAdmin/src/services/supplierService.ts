/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../lib/api'; // your Axios or fetch instance

const getAllSuppliers = async () => {
  const response = await api.get('/suppliers');
  return response.data;
};

const getSupplierById = async (id: number) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

const createSupplier = async (newSupplierData: any) => {
  // newSupplierData should include at least: { name, contactInfo, address }
  // The backend may set AddedByUserId and initialize Products
  const response = await api.post('/suppliers', newSupplierData);
  return response.data;
};

const updateSupplier = async (id: number, updatedData: any) => {
  await api.put(`/suppliers/${id}`, updatedData);
};

const deleteSupplier = async (id: number) => {
  await api.delete(`/suppliers/${id}`);
};

export default {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
