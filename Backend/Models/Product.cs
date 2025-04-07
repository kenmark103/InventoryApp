namespace Backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        
        public string SKU { get; set; } = string.Empty;
        
        public decimal BuyingPrice { get; set; }
        
        public decimal SellingPrice { get; set; }
        
        public decimal TaxRate { get; set; }
        
        public bool IsService { get; set; }
        
        // Represents the available stock quantity
        public int StockQuantity { get; set; }
        
        // Relationships
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;
        
        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
        
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        // Optional fields
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public string? Size { get; set; }
        public decimal? Weight { get; set; }
        
        // Collection for product gallery images
        public List<ProductImage> GalleryImages { get; set; } = new List<ProductImage>();
        
        // Collection for sale items in which this product is used
        public List<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
