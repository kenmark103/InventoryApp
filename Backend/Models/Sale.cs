namespace Backend.Models{
public class Sale
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty; // Auto-generated (e.g., INV-2024-001)
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public DateTime? DueDate { get; set; } // For credit terms
    public SaleStatus Status { get; set; } = SaleStatus.DRAFT;
    public string PaymentMethod { get; set; } = "CASH"; // Cash/Credit Card/Bank Transfer
    public string? Notes { get; set; }

    // Financials (calculated fields)
    public decimal Subtotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Discount { get; set; } // Flat or percentage
    public decimal Total => Subtotal + TaxAmount - Discount;

    // Relationships
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public int UserId { get; set; } // Employee who created the sale
    public User User { get; set; } = null!;
    public List<SaleItem> Items { get; set; } = new();
    public PaymentDetails? PaymentDetails { get; set; }
}
}