
export function mapSaleToSaleCreateDto(sale: Sale): SaleCreateDto {
   return {
    customerId: sale.customerId!, // Ensure non-null
    notes: sale.notes || '',
    dueDate: sale.dueDate,
    discount: sale.discount || 0, // Required field
    paymentMethod: sale.paymentMethod as PaymentMethod,
    items: sale.items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price 
    })),
    paymentDetails: sale.paymentDetails
  };
}