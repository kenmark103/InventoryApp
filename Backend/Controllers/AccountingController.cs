namespace Backend.Controllers;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

[ApiController]
[Route("api/[controller]")]
public class AccountingController : ControllerBase
{
    private readonly IAccountingService _acct;
    public AccountingController(IAccountingService acct) => _acct = acct;

    [HttpGet("ledger")]
    public async Task<IActionResult> GetLedger(DateTime start, DateTime end) =>
        Ok(await _acct.GetLedgerAsync(start, end));

    [HttpGet("trial-balance")]
    public async Task<IActionResult> GetTrialBalance(DateTime asOf) =>
        Ok(await _acct.GetTrialBalanceAsync(asOf));
}
