namespace Backend.Controllers;
using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly IAccountingService _acct;
    private readonly IWebHostEnvironment _env;

    public ExpensesController(AppDbContext context, IConfiguration config, IAccountingService acct, IWebHostEnvironment env)
    {
        _context = context;
        _config = config;
        _acct = acct;
        _env = env;
    }

    // GET: api/expenses (All expenses - Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetAllExpenses()
    {
        return await _context.Expenses
            .Include(e => e.User)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                Type = e.Type,
                Amount = e.Amount,
                TaxAmount = e.TaxAmount,
                Date = e.Date,
                Status = e.Status,
                ReceiptUrl = e.ReceiptUrl,
                Description= e.Description,
                Vendor = e.Vendor,
                SubmittedBy = e.User.Email
            })
            .ToListAsync();
    }

    // GET: api/expenses/my (Current user's expenses)
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetMyExpenses()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

        return await _context.Expenses
            .Where(e => e.UserId == user!.Id)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                Type = e.Type,
                Amount = e.Amount,
                TaxAmount = e.TaxAmount,
                Date = e.Date,
                Status = e.Status,
                ReceiptUrl = e.ReceiptUrl,
                Description = e.Description,
                Vendor = e.Vendor,
                SubmittedBy = e.User.Email
            })
            .ToListAsync();
    }

    // POST: api/expenses (Submit new expense)
    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense([FromForm] ExpenseCreateDto expenseDto)
    {
        // Get current user
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

        // Calculate tax (e.g., 16% VAT)
        var taxRate = _config.GetValue<decimal>("TaxSettings:VATRate");
        var taxAmount = expenseDto.Amount * taxRate;

        var expense = new Expense
        {
            Type = expenseDto.Type,
            Amount = expenseDto.Amount,
            TaxAmount = taxAmount,
            Description= expenseDto.Description ?? "N/A",
            Vendor     = expenseDto.Vendor ?? "Not Applicable",
            Date = DateTime.UtcNow,
            UserId = user!.Id,
            ReceiptUrl = await UploadReceipt(expenseDto.Receipt) // Implement file upload logic
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        var createdExpense = new ExpenseResponseDto
        {
            Id         = expense.Id,
            Type       = expense.Type,
            Amount     = expense.Amount,
            TaxAmount  = expense.TaxAmount,
            Date       = expense.Date,
            Status     = expense.Status,
            ReceiptUrl = expense.ReceiptUrl,
            Description= expense.Description,
            Vendor     = expense.Vendor,
            SubmittedBy = user.Email
        };

        return CreatedAtAction(nameof(GetMyExpenses), new { id = expense.Id }, createdExpense);

    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetPendingExpenses()
    {
        return await _context.Expenses
            .Where(e => e.Status == "Pending")
            .Include(e => e.User)
            .Select(e => new ExpenseResponseDto
            {
                Id = e.Id,
                Type = e.Type,
                Amount = e.Amount,
                TaxAmount = e.TaxAmount,
                Date = e.Date,
                Status = e.Status,
                ReceiptUrl = e.ReceiptUrl,
                Description = e.Description,
                Vendor = e.Vendor,
                SubmittedBy = e.User.Email
            })
            .ToListAsync();
    }


    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveExpense(int id, [FromBody] ExpenseUpdateDto dto)
    {
        if (!ModelState.IsValid)
        return BadRequest(ModelState);

        var expense = await _context.Expenses
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == id);
        
        if (expense == null)
            return NotFound();

        expense.Status = dto.Status;
        await _context.SaveChangesAsync();

        if (dto.Status.Equals("Approved", StringComparison.OrdinalIgnoreCase))

        {

            await _acct.RecordAsync(new AccountTransaction {
            Date = expense.Date,
            Description = $"Expense #{expense.Id}: {expense.Type}",
            Debit = expense.Amount + expense.TaxAmount,
            Credit = 0,
            Account = AccountType.Expenses
            });
            await _acct.RecordAsync(new AccountTransaction {
                Date = expense.Date,
                Description = $"Expense #{expense.Id}: {expense.Type}",
                Debit = 0,
                Credit = expense.Amount + expense.TaxAmount,
                Account = AccountType.Cash
            });

        }


        return NoContent();
    }

   private async Task<string?> UploadReceipt(IFormFile? file)
{
    if (file == null || file.Length == 0)
        return null;

    var webRootPath = _env.WebRootPath;
    if (string.IsNullOrEmpty(webRootPath))
    {
        webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        Directory.CreateDirectory(webRootPath);
    }

    var receiptsFolder = Path.Combine(webRootPath, "receipts");
    Directory.CreateDirectory(receiptsFolder);

    var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
    var filePath = Path.Combine(receiptsFolder, fileName);

    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }

    return $"/receipts/{fileName}";
}

}
