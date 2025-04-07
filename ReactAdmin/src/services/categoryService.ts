import api from '../lib/api';
import { Category } from '../data/categorySchema';

const API_BASE = '/categories';

const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get(API_BASE);
    return response.data;
  },
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get(`${API_BASE}/${id}`);
    return response.data;
  },
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post(API_BASE, data);
    return response.data;
  },
  updateCategory: async (id: number, data: Partial<Category>): Promise<Category> => {
    const response = await api.put(`${API_BASE}/${id}`, data);
    return response.data;
  },
  // Delete a category along with its subcategories.
  // Backend should cascade delete subcategories as well.
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`${API_BASE}/${id}`);
  },
};

export default categoryService;
