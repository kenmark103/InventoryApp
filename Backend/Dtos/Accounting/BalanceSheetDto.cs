namespace Backend.Dtos
{
    
    public class BalanceSheetDto
    {
     
        public BalanceSheetDto() { }

        public DateTime ReportDate       { get; set; }
        public decimal CashBalance       { get; set; }
        public decimal InventoryValue    { get; set; }
        public decimal AccountsPayable   { get; set; }
        public decimal RetainedEarnings  { get; set; }
    }

}