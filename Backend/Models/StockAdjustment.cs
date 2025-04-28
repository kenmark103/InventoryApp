namespace Backend.Models{

  public class StockAdjustment
  {
      public int Id { get; set; }
      public int ProductId { get; set; }
      public Product Product { get; set; }
      public int AdjustmentAmount { get; set; } // Can be positive or negative
      public string Reason { get; set; }
      public string Notes { get; set; }
      public DateTime AdjustedAt { get; set; } = DateTime.UtcNow;
      public string AdjustedBy { get; set; }
  }

}