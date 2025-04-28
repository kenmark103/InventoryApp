namespace Backend.Dtos
{
    public record CashFlowReportDto(
        
        DateTime StartDate,
        DateTime EndDate,
        decimal OperatingActivities, // Renamed from CashFromSales
        decimal InvestingActivities, // Renamed from OtherIncome
        decimal FinancingActivities  // Renamed from CashForPurchases
);
}
