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

    public ExpensesController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
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
                // ... same as above ...
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
        var taxRate = _config.GetValue<decimal>("TaxSettings:VATRate"); // Add to appsettings.json
        var taxAmount = expenseDto.Amount * taxRate;

        var expense = new Expense
        {
            Type = expenseDto.Type,
            Amount = expenseDto.Amount,
            TaxAmount = taxAmount,
            Date = DateTime.UtcNow,
            UserId = user!.Id,
            ReceiptUrl = await UploadReceipt(expenseDto.Receipt) // Implement file upload logic
        };

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyExpenses), new { id = expense.Id }, expense);
    }

    // PUT: api/expenses/5/approve (Admin only)
    [HttpPut("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveExpense(int id, ExpenseUpdateDto dto)
    {
        var expense = await _context.Expenses.FindAsync(id);
        if (expense == null)
            return NotFound();

        expense.Status = dto.Status;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Helper: Upload receipt to storage (e.g., Azure Blob)
    private async Task<string?> UploadReceipt(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return null;

        // Example: Save to wwwroot/receipts (for local testing)
        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var filePath = Path.Combine("wwwroot/receipts", fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/receipts/{fileName}";
    }
}