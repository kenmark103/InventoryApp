public class ProductResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public decimal BuyingPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public int Quantity { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string InventoryManager { get; set; } = string.Empty;
}