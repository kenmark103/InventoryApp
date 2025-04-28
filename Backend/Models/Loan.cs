// Models/Loan.cs
namespace Backend.Models
{
    public class Loan
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Active"; // Active/Paid
        public string Type { get; set; } = "Liability"; // Asset (money lent out) / Liability (money borrowed)
    }
}