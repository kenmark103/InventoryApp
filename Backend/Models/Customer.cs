// Models/Customer.cs
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Company { get; set; } // B2B support
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public List<Sale> Sales { get; set; } = new();
}