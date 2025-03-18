/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../lib/api'

const getAllUsers = async () => {
  const response = await api.get('/users'); 
  return response.data;
};

const createUser = async (newUserData: any) => {
    const response = await api.post('/users', newUserData);
    return response.data;
  };

const getUserById = async (id: any) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};


const updateUser = async (id: any, updatedData: any) => {
  await api.put(`/users/${id}`, updatedData);
};


const deleteUser = async (id: any) => {
  await api.delete(`/users/${id}`);
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
};
