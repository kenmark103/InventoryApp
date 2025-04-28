public class InventoryReportDto
{
    public DateTime GeneratedAt { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public int TotalStockItems { get; set; }
    public int LowStockItems { get; set; } // Quantity < 10
    public List<InventoryItemDto> Items { get; set; } = new();
    public List<StockMovementDto> RecentActivity { get; set; } = new();
}