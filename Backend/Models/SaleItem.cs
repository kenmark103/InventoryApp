namespace Backend.Models
{
    public class SaleItem
    {
        public int Id { get; set; }
        
        public int Quantity { get; set; }
        
        public decimal UnitPrice { get; set; }
        
        public decimal TaxRate { get; set; } // For example, 0.16 for 16% VAT
        
        // Relationships
        public int SaleId { get; set; }
        public Sale Sale { get; set; } = null!;
        
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
