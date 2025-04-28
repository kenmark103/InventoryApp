namespace Backend.Dtos
{
    public record ProfitLossReportDto(
        DateTime StartDate,
        DateTime EndDate,
        decimal TotalRevenue,
        decimal CostOfGoodsSold,
        decimal TotalExpenses,
        Dictionary<string, decimal> ExpenseByCategory,
        Dictionary<string, decimal> RevenueByProduct
    )
    {
        public decimal NetProfit => TotalRevenue - CostOfGoodsSold - TotalExpenses;
    }
}
