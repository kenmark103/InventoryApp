using System.ComponentModel.DataAnnotations;

public class SaleCompleteRequestDto 
{
    public PaymentDetailsDto PaymentDetails { get; set; } = null!;
}