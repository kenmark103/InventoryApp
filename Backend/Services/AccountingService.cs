using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Dtos;
using Backend.Models;

public class AccountingService : IAccountingService
{
    private readonly AppDbContext _ctx;
    public AccountingService(AppDbContext ctx) => _ctx = ctx;

    public async Task RecordAsync(AccountTransaction transaction)
    {
        _ctx.AccountTransactions.Add(transaction);
        await _ctx.SaveChangesAsync();
    }

    public async Task<IEnumerable<AccountTransaction>> GetLedgerAsync(DateTime from, DateTime to) =>
        await _ctx.AccountTransactions
                  .Where(t => t.Date >= from && t.Date <= to)
                  .OrderBy(t => t.Date)
                  .ToListAsync();

    // Updated to return Task<TrialBalanceDto>
    public async Task<TrialBalanceDto> GetTrialBalanceAsync(DateTime asOf)
    {
        var grouped = await _ctx.AccountTransactions
            .Where(t => t.Date <= asOf)
            .GroupBy(t => t.Account)
            .Select(g => new {
                Account = g.Key,
                Debit = g.Sum(x => x.Debit),
                Credit = g.Sum(x => x.Credit)
            })
            .ToListAsync();

        var dto = new TrialBalanceDto
        {
            AsOf = asOf,
            Balances = grouped.ToDictionary(
                x => x.Account.ToString(),
                x => x.Debit - x.Credit
            )
        };

        return dto;
    }
}
