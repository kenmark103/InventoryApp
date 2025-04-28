using System.Text.Json.Serialization;

namespace Backend.Dtos
{
    public class DashboardMetricsDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal TotalPurchases { get; set; }
        public int MonthlySales { get; set; }
        public decimal TotalExpenses { get; set; }
        
        [JsonPropertyName("trends")]
        public Dictionary<string, decimal> TrendPercentages { get; set; }
    }

}