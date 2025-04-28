using Backend.Models;
using Backend.Dtos;

public interface IAccountingService
{
    Task RecordAsync(AccountTransaction transaction);
    Task<IEnumerable<AccountTransaction>> GetLedgerAsync(DateTime from, DateTime to);
    Task<TrialBalanceDto> GetTrialBalanceAsync(DateTime asOf);
}
