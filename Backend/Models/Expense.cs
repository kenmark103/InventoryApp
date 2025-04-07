namespace Backend.Models
{
    public class Expense
        {
            public int Id { get; set; }
            public string Type { get; set; } = string.Empty; // Rent, Salaries, Utilities, etc.
            public decimal Amount { get; set; }
            public DateTime Date { get; set; } = DateTime.UtcNow;
            public string Status { get; set; } = "Pending"; // Pending/Approved/Rejected
            public string? ReceiptUrl { get; set; } // Path to uploaded receipt
            public decimal TaxAmount { get; set; } // Auto-calculated tax (e.g., VAT)

            // Relationships
            public int UserId { get; set; } // Submitted by
            public User User { get; set; } = null!;
        }
}