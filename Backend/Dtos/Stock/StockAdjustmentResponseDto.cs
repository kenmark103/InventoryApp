public class StockAdjustmentResponseDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public int AdjustmentAmount { get; set; }
    public string Reason { get; set; }
    public string Notes { get; set; }
    public DateTime AdjustedAt { get; set; }
    public string AdjustedBy { get; set; }
}