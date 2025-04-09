using Backend.Models;

public class SaleReceiptDto : SaleResponseDto 
{
    public CompletedSaleDto? PaymentInfo { get; set; }
    public string? ReceiptNumber { get; set; }
    public DateTime PaymentDate { get; set; }
}