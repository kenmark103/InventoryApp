public class SaleResponseDto
{
    public int Id { get; set; }
    
    public string InvoiceNumber { get; set; } = string.Empty;
    
    public DateTime SaleDate { get; set; }
    
    public string Status { get; set; } = string.Empty;
    
    public string PaymentMethod { get; set; } = string.Empty;
    
    public decimal Subtotal { get; set; }
    
    public decimal TaxAmount { get; set; }
    
    public decimal Discount { get; set; }
    
    public decimal Total { get; set; }
    
    public string CustomerName { get; set; } = string.Empty;
    
    public string ProcessedBy { get; set; } = string.Empty; // User email
    
    public List<SaleItemResponseDto> Items { get; set; } = new();
}
