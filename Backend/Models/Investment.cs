// Models/Investment.cs
namespace Backend.Models
{
    public class Investment
    {
        public int Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public decimal Amount { get; set; }
        public string Type { get; set; } = "Equipment";
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Active"; // Active/Sold
    }
}