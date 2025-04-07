using System.Text.Json.Serialization;

namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        
        public string FirstName { get; set; } = string.Empty;
        
        public string LastName { get; set; } = string.Empty;
        
        public string Username { get; set; } = string.Empty;
        
        public string PhoneNumber { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Active";
        
        public string Email { get; set; } = string.Empty;
        
        public string PasswordHash { get; set; } = string.Empty;
        
        public string Role { get; set; } = "Cashier";
        
        public bool IsEmailVerified { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [JsonIgnore]
        public List<Product> Products { get; set; } = new List<Product>();
        
        public List<Expense> Expenses { get; set; } = new List<Expense>();
        
        public List<Sale> Sales { get; set; } = new List<Sale>();
    }
}
