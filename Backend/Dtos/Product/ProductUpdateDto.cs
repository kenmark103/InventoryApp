using System.ComponentModel.DataAnnotations;

public class ProductUpdateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string SKU { get; set; } = string.Empty;

    [Required, Range(0.01, double.MaxValue)]
    public decimal BuyingPrice { get; set; }

    [Required, Range(0.01, double.MaxValue)]
    public decimal SellingPrice { get; set; }

    [Required, Range(0.0, double.MaxValue)]
    public decimal TaxRate { get; set; }

    [Required]
    public bool IsService { get; set; }

    [Required, Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    public int SupplierId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public string? Size { get; set; }
    public decimal? Weight { get; set; }

    // New property for multiple gallery images
    public List<string>? GalleryImages { get; set; }
}
