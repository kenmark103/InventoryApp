public class CashFlowReportDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    // Inflows
    public decimal CashFromSales { get; set; }
    public decimal OtherIncome { get; set; }
    public decimal TotalInflows => CashFromSales + OtherIncome;
    
    // Outflows
    public decimal CashForExpenses { get; set; }
    public decimal CashForPurchases { get; set; }
    public decimal TotalOutflows => CashForExpenses + CashForPurchases;
    
    public decimal NetCashFlow => TotalInflows - TotalOutflows;
}