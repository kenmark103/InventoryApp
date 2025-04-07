using Backend.Models;

public class SaleReceiptDto : SaleResponseDto 
{
    public PaymentDetailsDto PaymentDetails { get; set; } = null!;
    public string? ReceiptNumber { get; set; }
    public DateTime? PaymentDate { get; set; }
}