using System.ComponentModel.DataAnnotations;

public class ProductCreateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string SKU { get; set; } = string.Empty;

    [Required, Range(0.01, double.MaxValue)]
    public decimal BuyingPrice { get; set; }

    [Required, Range(0.01, double.MaxValue)]
    public decimal SellingPrice { get; set; }

    [Required, Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    public int SupplierId { get; set; }
}