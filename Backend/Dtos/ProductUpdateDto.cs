using System.ComponentModel.DataAnnotations;

public class ProductUpdateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required, Range(0.01, double.MaxValue)]
    public decimal SellingPrice { get; set; }

    [Required, Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}