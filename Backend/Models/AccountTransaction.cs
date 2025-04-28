
namespace Backend.Models
{
    public enum AccountType
    {
        Cash, AccountsReceivable, Inventory,
        SalesRevenue, CostOfGoodsSold,
        Expenses, AccountsPayable, Equity
    }

    public class AccountTransaction
    {
        public int Id { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Description { get; set; } = string.Empty;
        
        
        public decimal Debit { get; set; }

        public decimal Credit { get; set; }

        
        public AccountType Account { get; set; }

        public int? SaleId { get; set; }
        public Sale? Sale { get; set; }

        public int? ExpenseId { get; set; }
        public Expense? Expense { get; set; }

        public int? PurchaseId { get; set; }
        public Purchase? Purchase { get; set; }
    }
}
