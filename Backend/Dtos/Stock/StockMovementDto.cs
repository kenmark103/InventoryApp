public class StockMovementDto
{
    public DateTime Date { get; set; }
    public string Type { get; set; } // Purchase, Sale, Adjustment
    public string Reference { get; set; } // Invoice/PO Number
    public int QuantityChange { get; set; }
    public int NewBalance { get; set; }
}