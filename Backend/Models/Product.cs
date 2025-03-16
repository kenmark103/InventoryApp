
public class Product
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? SKU { get; set; } 
    public decimal BuyingPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal TaxRate { get; set; } 
    public bool IsService { get; set; }
    public int StockQuantity { get; set; }
    public DateTime CreatedAt { get; internal set; }
    
    // Relationships
    public int SupplierId { get; set; }  
    public int UserId { get; set; }      // Inventory manager
    public Supplier Supplier { get; set; } = new();
    public User User { get; set; } = new();
    public List<SaleItem> SaleItems { get; set; } = new(); // Fix: Link to SaleItem, not Sale
}