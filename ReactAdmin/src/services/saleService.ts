import api from '../lib/api';
import type { SaleResponseDto, SaleCreateDto, SaleUpdateDto } from '../types';

const saleService = {

  getSales: async (): Promise<SaleResponseDto[]> => 
    api.get('/sales').then(res => res.data),

  getSaleById: async (id: number): Promise<SaleResponseDto> =>
    api.get(`/sales/${id}`).then(res => res.data),

  /* createSale: async (dto: SaleCreateDto): Promise<SaleResponseDto> =>
    api.post('/sales', dto).then(res => res.data), */

    createSale: async (dto: SaleCreateDto): Promise<SaleResponseDto> => {
      console.log(dto);
    try {
      const res = await api.post('/sales', dto);
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Full error:', error.toJSON());
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  },

  updateSale: async (id: number, dto: SaleUpdateDto): Promise<SaleResponseDto> =>
    api.put(`/sales/${id}`, dto).then(res => res.data),

  // Safe deletion implementation
  deleteSale: async (id: number): Promise<void> => {
    
    if (!localStorage.getItem('isAdmin')) {
      throw new Error('Delete requires admin privileges');
    }
    
    return api.delete(`/sales/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
  },

  // Recommended alternatives to deletion
  cancelSale: async (id: number): Promise<SaleResponseDto> =>
    api.patch(`/sales/${id}/cancel`).then(res => res.data),

  voidSale: async (id: number): Promise<SaleResponseDto> =>
    api.patch(`/sales/${id}/void`).then(res => res.data),

  // Customer/Product integrations
  getCustomers: async (): Promise<Customer[]> =>
    api.get('/customers').then(res => res.data),

  getProducts: async (): Promise<Product[]> =>
    api.get('/products').then(res => res.data)
};

export default saleService;