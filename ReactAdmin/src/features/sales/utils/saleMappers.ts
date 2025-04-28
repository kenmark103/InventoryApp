import { Sale, SaleCreateDto } from "../data/sales-schema";

export function mapSaleToSaleCreateDto(sale: Sale): SaleCreateDto {

  return {
    customerId: sale.customerId!,
    notes: sale.notes || '',
    dueDate: sale.dueDate,
    discount: sale.discount,
    paymentMethod: sale.paymentMethod,
    items: sale.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0
    })),
    paymentDetails: sale.paymentDetails
    ? {...sale.paymentDetails}
    : undefined
  };
}