import api from '../lib/api';
import axios, { AxiosRequestConfig } from 'axios';
import type { SaleResponseDto, SaleCreateDto, SaleUpdateDto } from '../types';

const saleService = {

  getSales: async (): Promise<SaleResponseDto[]> => 
    api.get('/sales').then(res => res.data),

  getSaleById: async (id: number): Promise<SaleResponseDto> =>
    api.get(`/sales/${id}`).then(res => res.data),


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


   completeSale: async (    id: number, paymentDetails: PaymentDetails,  config?: AxiosRequestConfig  ): Promise<SaleResponseDto> => {
    try {
      const res = await api.post(
        `/sales/${id}/complete`,
        { paymentDetails },
        config
      );
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Complete sale error:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        throw new Error(error.response?.data || 'Payment processing failed');
      }
      console.error('Unexpected error:', error);
      throw new Error('Failed to complete sale');
    }
  },

  getPaymentStatus: async (transactionId: string): Promise<{ status: string }> => {
    return api.get(`/payments/status/${transactionId}`).then(res => res.data);
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


  getReceipt: async (id: number): Promise<SaleReceiptDto> => {
    try {
      const res = await api.get(`/sales/${id}/receipt`);
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Receipt fetch error:', {
          status: error.response?.status,
          data: error.response?.data
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch receipt');
      }
      throw new Error('Unexpected error fetching receipt');
    }
  },


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