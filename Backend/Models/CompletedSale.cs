namespace Backend.Models{
    public class CompletedSale
{
    public int Id { get; set; }
    public DateTime CompletedDate { get; set; } = DateTime.UtcNow;
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public string PaymentMethod { get; set; } = "CASH";
    public string? TransactionId { get; set; }
    public decimal AmountTendered { get; set; }
    public decimal ChangeDue { get; set; }
}
}