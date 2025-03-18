using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string Name {get; set;} = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Cashier";
    public bool IsEmailVerified { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [JsonIgnore]
    public List<Product> Products { get; set; } = new();
    public List<Expense> Expenses { get; set; } = new();
    public List<Sale> Sales { get; set; } = new();
}