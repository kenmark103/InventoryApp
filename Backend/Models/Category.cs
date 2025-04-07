namespace Backend.Models
{
    public class Category
    {
        public int Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        public string Status { get; set; } = "active";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property for products in this category
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
