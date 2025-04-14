using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PurchaseCreateDto
    {
        [Required] public int ProductId { get; set; }
        [Required] public int SupplierId { get; set; }
        [Required][Range(1, int.MaxValue)] public int Quantity { get; set; }
        [Required][Range(0.01, double.MaxValue)] public decimal UnitPrice { get; set; }
        [Required][Range(0.01, double.MaxValue)] public decimal TotalPrice { get; set; }
        [Required] public DateTime PurchaseDate { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? Notes { get; set; }
    }
}
