namespace Backend.Models
{
    public class Expense
        {
            public int Id { get; set; }
            public string Type { get; set; } = string.Empty; // Rent, Salaries, Utilities, etc.
            public decimal Amount { get; set; }
            public DateTime Date { get; set; } = DateTime.UtcNow;
            public string Status { get; set; } = "Pending";
            public string? ReceiptUrl { get; set; } 
            public decimal TaxAmount { get; set; }
            public string? Description { get; set; }
            public string? Vendor {get; set;}

            // Relationships
            public int UserId { get; set; }
            public User User { get; set; } = null!;
        }
}