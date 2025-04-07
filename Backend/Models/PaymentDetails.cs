
namespace Backend.Models
{
    public class PaymentDetails
    {
        public string Method { get; set; } = "CASH";

        public string? TransactionId { get; set; }

        public decimal AmountTendered { get; set; }
        
        public decimal ChangeDue { get; set; }

        public int SaleId { get; set; }
        public Sale Sale { get; set; } = null!;     
    }

}
