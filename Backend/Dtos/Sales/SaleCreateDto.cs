using System.ComponentModel.DataAnnotations;

public class SaleCreateDto
{
    [Required]
    public int CustomerId { get; set; }

    public string? Notes { get; set; }
    
    public string PaymentMethod { get; set; } = "CASH";
    
    public DateTime? DueDate { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Discount { get; set; } = 0; // Could be % or flat (add DiscountType if needed)

    [Required, MinLength(1)]
    public List<SaleItemDto> Items { get; set; } = new();

    public PaymentDetailsDto? PaymentDetails { get; set; }
}
