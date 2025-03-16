public class BalanceSheetDto
{
    public DateTime ReportDate { get; set; }
    
    // Assets
    public decimal CashBalance { get; set; }
    public decimal InventoryValue { get; set; }
    public decimal TotalAssets => CashBalance + InventoryValue;
    
    // Liabilities
    public decimal AccountsPayable { get; set; } // Unpaid expenses
    public decimal TotalLiabilities => AccountsPayable;
    
    // Equity
    public decimal RetainedEarnings { get; set; } // Net profit over time
    public decimal TotalEquity => TotalAssets - TotalLiabilities;
}