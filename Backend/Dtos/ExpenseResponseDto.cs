public class ExpenseResponseDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal TaxAmount { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ReceiptUrl { get; set; }
    public string SubmittedBy { get; set; } = string.Empty; // User email
}