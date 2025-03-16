using System.Text.Json.Serialization;

public class Supplier
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContactInfo { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    
    // Track who added the supplier
    public int AddedByUserId { get; set; }
    public User AddedByUser { get; set; } = null!;

    // Relationships
    [JsonIgnore]
    public List<Product> Products { get; set; } = new();
}