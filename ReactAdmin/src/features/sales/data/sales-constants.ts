import {SaleStatus} from './sales-schema';

export const statusColors = {
    [SaleStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [SaleStatus.PAID]: 'bg-blue-100 text-blue-800',
    [SaleStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [SaleStatus.HOLD]: 'bg-yellow-100 text-yellow-800',
    [SaleStatus.CANCELLED]: 'bg-red-100 text-red-800'
  };