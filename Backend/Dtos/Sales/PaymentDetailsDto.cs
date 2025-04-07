using System.ComponentModel.DataAnnotations;

public class PaymentDetailsDto

{
    public string Method { get; set; } = "CASH";
    public string? TransactionId { get; set; }
    public decimal AmountTendered { get; set; }
    public decimal ChangeDue { get; set; }
    public string? MpesaPhone { get; set; }

}