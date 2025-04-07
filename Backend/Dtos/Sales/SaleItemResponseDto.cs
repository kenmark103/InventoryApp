public class SaleItemResponseDto
{
    public string ProductName { get; set; } = string.Empty;
    
    public int Quantity { get; set; }
    
    public decimal UnitPrice { get; set; }
    
    public decimal TaxRate { get; set; }
    
    public decimal LineTotal => Quantity * UnitPrice * (1 + TaxRate);
}
