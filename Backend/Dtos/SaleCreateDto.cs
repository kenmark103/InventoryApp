using System.ComponentModel.DataAnnotations;

public class SaleCreateDto
{
    [Required]
    public int CustomerId { get; set; }

    public string? Notes { get; set; }
    public string PaymentMethod { get; set; } = "Cash";
    public DateTime? DueDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Discount { get; set; } // Could be % or flat (add DiscountType if needed)

    [Required, MinLength(1)]
    public List<SaleItemDto> Items { get; set; } = new();
}