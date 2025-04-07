using System.ComponentModel.DataAnnotations;
public class ProductResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal BuyingPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal TaxRate { get; set; }
    public bool IsService { get; set; }
    // Quantity represents the StockQuantity
    public int Quantity { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string InventoryManager { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    // New property to hold multiple gallery images
    public List<string> GalleryImages { get; set; } = new List<string>();
}
