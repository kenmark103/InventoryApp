
using Backend.Models;
using Backend.Dtos;
using System.Linq;           
using System.Collections.Generic; 

namespace Backend.Helpers
{
    public static class SaleMapper
    {
        public static SaleResponseDto MapToResponseDto(this Sale sale)
        {
            return new SaleResponseDto
            {
                Id            = sale.Id,
                InvoiceNumber = sale.InvoiceNumber,
                SaleDate      = sale.SaleDate,
                Status        = sale.Status.ToString(),
                PaymentMethod = sale.PaymentMethod,
                Subtotal      = sale.Subtotal,
                TaxAmount     = sale.TaxAmount,
                Discount      = sale.Discount,
                Total         = sale.Total,
                CustomerName  = sale.Customer.Name,
                ProcessedBy   = sale.User.Email,
                Items         = sale.Items
                                  .Select(i => new SaleItemResponseDto
                                  {
                                      ProductName = i.Product.Name,
                                      Quantity    = i.Quantity,
                                      UnitPrice   = i.UnitPrice,
                                      TaxRate     = i.TaxRate
                                  })
                                  .ToList(),

                CompletedSale = sale.CompletedSale is not null
                    ? new CompletedSaleDto
                      {
                          PaymentMethod  = sale.CompletedSale.PaymentMethod,
                          TransactionId  = sale.CompletedSale.TransactionId ?? "n/a",
                          AmountTendered = sale.CompletedSale.AmountTendered,
                          ChangeDue      = sale.CompletedSale.ChangeDue
                      }
                    : null
            };
        }
    }
}
