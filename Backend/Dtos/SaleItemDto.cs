using System.ComponentModel.DataAnnotations;

public class SaleItemDto
{
    [Required]
    public int ProductId { get; set; }

    [Required, Range(1, 1000)]
    public int Quantity { get; set; }

    public decimal? PriceOverride { get; set; } // Allow manual price adjustments
}