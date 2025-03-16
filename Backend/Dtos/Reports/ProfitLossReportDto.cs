public class ProfitLossReportDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Revenue
    public decimal TotalRevenue { get; set; }     // Sum of all sales
    public decimal CostOfGoodsSold { get; set; }  // Sum of product buying costs
    public decimal GrossProfit => TotalRevenue - CostOfGoodsSold;
    
    // Expenses
    public decimal TotalExpenses { get; set; }    // Sum of approved expenses (including taxes)
    public decimal NetProfit => GrossProfit - TotalExpenses;
    
    // Breakdowns (optional)
    public Dictionary<string, decimal> ExpenseByCategory { get; set; } = new();
    public Dictionary<string, decimal> RevenueByProduct { get; set; } = new();
}