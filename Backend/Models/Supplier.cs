using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        
        public string Name { get; set; } = string.Empty;
        
        public string? Email { get; set; }
        
        public string? Phone { get; set; }
        
        public string? Address { get; set; }
        
        public string? Company { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Track who added the supplier
        public int AddedByUserId { get; set; }
        public User AddedByUser { get; set; } = null!;
        
        // Navigation property for products from this supplier
        [JsonIgnore]
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
