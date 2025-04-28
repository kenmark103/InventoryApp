public class InventoryItemDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string SKU { get; set; }
    public string Category { get; set; }
    public string Supplier { get; set; }
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TotalValue { get; set; }
    public DateTime LastStocked { get; set; }
    public string Status { get; set; } // "In Stock", "Low Stock", "Out of Stock"
}