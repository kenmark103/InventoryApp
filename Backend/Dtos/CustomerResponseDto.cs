public class CustomerResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Company { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalSales { get; set; } // Number of sales linked to this customer
}