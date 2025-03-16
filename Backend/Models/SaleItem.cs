public class SaleItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TaxRate { get; set; } // e.g., 16% VAT (per item, if needed)

    // Relationships
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int ProductId { get; set; } // Link to a Product model (see below)
    public Product Product { get; set; } = null!;
}