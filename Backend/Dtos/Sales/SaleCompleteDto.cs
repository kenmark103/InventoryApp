using System.ComponentModel.DataAnnotations;

public class SaleCompleteDto 
{
    public PaymentDetailsDto PaymentDetails { get; set; } = null!;
}