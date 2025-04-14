using System;

namespace Backend.Models
{
    public class PurchaseResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int SupplierId { get; set; }
        public string SupplierName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? Notes { get; set; }

        // Renamed from AddedByEmail
        public string CreatedByEmail { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
