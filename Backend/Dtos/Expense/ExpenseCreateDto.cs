using System.ComponentModel.DataAnnotations;

public class ExpenseCreateDto
{
    [Required]
    public string Type { get; set; } = string.Empty;

    [Required, Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    public IFormFile? Receipt { get; set; }

    public string? Description { get; set; }
    
    public string? Vendor {get; set;}
}