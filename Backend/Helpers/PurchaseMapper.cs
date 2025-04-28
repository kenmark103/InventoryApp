using Backend.Models;
using Backend.Dtos;
using System.Linq;           
using System.Collections.Generic; 

namespace Backend.Helpers
{
    public static class PurchaseMapper
    {
        public static PurchaseResponseDto ToDto(this Purchase purchase)
        {
            return new PurchaseResponseDto
            {
                Id = purchase.Id,
                ProductId = purchase.ProductId,
                ProductName = purchase.Product?.Name ?? string.Empty,
                SupplierId = purchase.SupplierId,
                SupplierName = purchase.Supplier?.Name ?? string.Empty,
                Quantity = purchase.Quantity,
                UnitPrice = purchase.UnitPrice,
                TotalPrice = purchase.TotalPrice,
                PurchaseDate = purchase.PurchaseDate,
                InvoiceNumber = purchase.InvoiceNumber,
                Notes = purchase.Notes,
                CreatedByEmail = purchase.User?.Email ?? string.Empty,
                CreatedAt = purchase.CreatedAt
            };
        }
    }
}