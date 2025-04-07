namespace Backend.Models
{
    public class Notification
    {
        public int Id { get; set; }
        
        public string Message { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsRead { get; set; } = false;
        
        // Link to the Product (optional but useful for UI)
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
    }
}
