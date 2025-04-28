namespace Backend.Controllers;
using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using Backend.Models;
using Backend.Helpers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Finance")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/reports/profit-loss?start=2024-01-01&end=2024-12-31
    [HttpGet("profit-loss")]
    public async Task<ActionResult<ProfitLossReportDto>> GetProfitLossReport(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        // Fetch sales and expenses within the date range
        var sales = await _context.Sales
            .Include(s => s.Items)
            .ThenInclude(i => i.Product)
            .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
            .ToListAsync();

        var expenses = await _context.Expenses
            .Where(e => e.Date >= startDate && e.Date <= endDate && e.Status == "Approved")
            .ToListAsync();

        // Calculate revenue and COGS
        var totalRevenue = sales.Sum(s => s.Items.Sum(i => i.UnitPrice * i.Quantity));
        var cogs = sales.Sum(s => s.Items.Sum(i => i.Product.BuyingPrice * i.Quantity));

        // Calculate total expenses
        var totalExpenses = expenses.Sum(e => e.Amount + e.TaxAmount);

        // Build breakdowns
        var expenseByCategory = expenses
            .GroupBy(e => e.Type)
            .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount + e.TaxAmount));

        var revenueByProduct = sales
            .SelectMany(s => s.Items)
            .GroupBy(i => i.Product.Name)
            .ToDictionary(g => g.Key, g => g.Sum(i => i.UnitPrice * i.Quantity));

        return new ProfitLossReportDto(
            startDate,
            endDate,
            totalRevenue,
            cogs,
            totalExpenses,
            expenseByCategory,
            revenueByProduct
        );
    }

    [HttpGet("cash-flow")]
public async Task<ActionResult<CashFlowReportDto>> GetCashFlowReport(DateTime startDate, DateTime endDate)
{
   
    var operating = await _context.Sales
        .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
        .Select(s => s.Subtotal + s.TaxAmount - s.Discount)
        .SumAsync();

    
    var investing = await _context.Investments
        .Where(i => i.Date >= startDate && i.Date <= endDate)
        .SumAsync(i => i.Amount);

   
    var financing = await _context.Loans
        .Where(l => l.Date >= startDate && l.Date <= endDate)
        .SumAsync(l => l.Type == "Liability" ? l.Amount : -l.Amount);

    return new CashFlowReportDto(
        startDate,
        endDate,
        operating,
        investing,
        financing
    );
}

[HttpGet("balance-sheet")]
public async Task<ActionResult<BalanceSheetDto>> GetBalanceSheet()
{

    var totalSales = await _context.Sales
        .Select(s => s.Subtotal + s.TaxAmount - s.Discount)
        .SumAsync();

   
    var totalExpenses = await _context.Expenses
        .SumAsync(e => e.Amount + e.TaxAmount);

    var cashBalance = totalSales - totalExpenses;

    var inventoryValue = await _context.Products
        .SumAsync(p => p.BuyingPrice * p.StockQuantity);

    var accountsPayable = await _context.Expenses
        .Where(e => e.Status == "Pending")
        .SumAsync(e => e.Amount + e.TaxAmount);

    var reportDate = DateTime.UtcNow;

    return new BalanceSheetDto
        {
            ReportDate      = reportDate,
            CashBalance     = cashBalance,
            InventoryValue  = inventoryValue,
            AccountsPayable = accountsPayable,
            RetainedEarnings   = cashBalance
        };
}

 [HttpGet("sales")]
public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetSalesReport(
    [FromQuery] DateTime? startDate,
    [FromQuery] DateTime? endDate,  
    [FromQuery] int? limit = null)          
{

     IQueryable<Sale> query = _context.Sales
        .Include(s => s.Customer)
        .Include(s => s.User)
        .Include(s => s.Items)
            .ThenInclude(i => i.Product);

   
    var utcStart = startDate?.ToUniversalTime();
    var utcEnd = endDate?.ToUniversalTime();

    
    if (utcStart.HasValue)
        query = query.Where(s => s.SaleDate >= utcStart.Value);
        
    if (utcEnd.HasValue)
        query = query.Where(s => s.SaleDate <= utcEnd.Value);

   
    query = query.OrderByDescending(s => s.SaleDate);

   
    if (limit.HasValue && limit > 0)
        query = query.Take(limit.Value);


    var sales = await query.ToListAsync();
    var dto = sales.Select(s => s.MapToResponseDto()).ToList();
    return Ok(dto);
}


// GET: api/reports/expenses
[HttpGet("expenses")]
public async Task<ActionResult<IEnumerable<ExpenseResponseDto>>> GetExpensesReport(
    [FromQuery] DateTime? startDate,
    [FromQuery] DateTime? endDate,
    [FromQuery] string? status = null)
{
    IQueryable<Expense> query = _context.Expenses
        .Include(e => e.User)
        .OrderByDescending(e => e.Date);

    if (startDate.HasValue)
        query = query.Where(e => e.Date >= startDate.Value);
    
    if (endDate.HasValue)
        query = query.Where(e => e.Date <= endDate.Value);

    if (!string.IsNullOrEmpty(status))
        query = query.Where(e => e.Status == status);

    var expenses = await query.ToListAsync();

    return expenses.Select(e => new ExpenseResponseDto
    {
        Id = e.Id,
        Type = e.Type,
        Amount = e.Amount,
        TaxAmount = e.TaxAmount,
        Date = e.Date,
        Status = e.Status,
        Vendor = e.Vendor,
        Description = e.Description,
        ReceiptUrl = e.ReceiptUrl,
        SubmittedBy = e.User.Email
    }).ToList();
}


[HttpGet("export")]
public async Task<IActionResult> ExportReport(
    [FromQuery] DateTime startDate,
    [FromQuery] DateTime endDate,
    [FromQuery] string format = "pdf",
    [FromQuery] string reportType = "profit-loss") // pdf/excel
{
     if (reportType == "expenses")
    {
        var expensesData = await GetExpensesReport(startDate, endDate, "Approved");
        if (format == "pdf")
        {
            var pdfBytes = GenerateExpensesPdfReport(expensesData.Value);
            return File(pdfBytes, "application/pdf", "ExpensesReport.pdf");
        }
        else
        {
            var excelStream = GenerateExpensesExcelReport(expensesData.Value);
            return File(excelStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ExpensesReport.xlsx");
        }
    }
    else
    {
        var pnlData = await GetProfitLossReport(startDate, endDate);

        if (format == "pdf")
        {
            var pdfBytes = GeneratePdfReport(pnlData.Value);
            return File(pdfBytes, "application/pdf", "ProfitLossReport.pdf");
        }
        else
        {
            var excelStream = GenerateExcelReport(pnlData.Value);
            return File(excelStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ProfitLossReport.xlsx");
        }
    }
}



[HttpGet("metrics")]
public async Task<ActionResult<DashboardMetricsDto>> GetDashboardMetrics()
{
    var today = DateTime.UtcNow;
    var currentStart = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);
    var previousStart = currentStart.AddMonths(-1);

    var previousMetrics = await GetMetricsForMonth(previousStart);
    var currentMetrics = await GetMetricsForMonth(currentStart);

    if (currentMetrics == null || previousMetrics == null)
        return NotFound();

    return new DashboardMetricsDto
    {
        TotalRevenue = currentMetrics.TotalRevenue,
        TotalPurchases = currentMetrics.TotalPurchases,
        MonthlySales = currentMetrics.MonthlySales,
        TotalExpenses = currentMetrics.TotalExpenses,
        TrendPercentages = new Dictionary<string, decimal>
        {
            ["revenue"] = CalculateTrend(currentMetrics.TotalRevenue, previousMetrics.TotalRevenue),
            ["purchases"] = CalculateTrend(currentMetrics.TotalPurchases, previousMetrics.TotalPurchases),
            ["sales"] = CalculateTrend(currentMetrics.MonthlySales, previousMetrics.MonthlySales),
            ["expenses"] = CalculateTrend(currentMetrics.TotalExpenses, previousMetrics.TotalExpenses)
        }
    };
}

private async Task<MonthlyMetrics> GetMetricsForMonth(DateTime monthStart)
{
    var utcMonthStart = monthStart.Kind == DateTimeKind.Utc 
        ? monthStart 
        : new DateTime(monthStart.Ticks, DateTimeKind.Utc);

    var nextMonthStart = utcMonthStart.AddMonths(1);

    return new MonthlyMetrics
    {
        TotalRevenue = await _context.Sales
            .Where(s => s.SaleDate >= utcMonthStart && s.SaleDate < nextMonthStart)
            .SumAsync(s => s.Subtotal + s.TaxAmount - s.Discount),
            
        TotalPurchases = await _context.Purchases
            .Where(p => p.PurchaseDate >= utcMonthStart && p.PurchaseDate < nextMonthStart)
            .SumAsync(p => p.TotalPrice),
            
        MonthlySales = await _context.Sales
            .CountAsync(s => s.SaleDate >= utcMonthStart && s.SaleDate < nextMonthStart),
            
        TotalExpenses = await _context.Expenses
            .Where(e => e.Date >= utcMonthStart && e.Date < nextMonthStart && e.Status == "Approved")
            .SumAsync(e => e.Amount + e.TaxAmount)
    };
}


private decimal CalculateTrend(decimal current, decimal previous) => 
    previous == 0 ? 0 : ((current - previous) / previous) * 100;


// GET: api/reports/inventory
[HttpGet("inventory")]
public async Task<ActionResult<InventoryReportDto>> GetInventoryReport(
    [FromQuery] bool includeInactive = false,
    [FromQuery] int lowStockThreshold = 10)
{
    var report = new InventoryReportDto
    {
        GeneratedAt = DateTime.UtcNow
    };

    // Get base product query
    var productsQuery = _context.Products
        .Include(p => p.Supplier)
        .Include(p => p.Category)
        .Include(p => p.StockAdjustments)
        .AsQueryable();

    if (!includeInactive)
    {
        productsQuery = productsQuery.Where(p => p.StockQuantity > 0);
    }

    // Map inventory items
    var products = await productsQuery.ToListAsync();
    report.Items = products.Select(p => new InventoryItemDto
    {
        Id = p.Id,
        Name = p.Name,
        SKU = p.SKU,
        Category = p.Category.Name,
        Supplier = p.Supplier.Name,
        Quantity = p.StockQuantity,
        UnitCost = p.BuyingPrice,
        TotalValue = p.BuyingPrice * p.StockQuantity,
        LastStocked = p.StockAdjustments.Any() 
            ? p.StockAdjustments.Max(a => a.AdjustedAt)
            : p.CreatedAt,
        Status = p.StockQuantity == 0 ? "Out of Stock" :
                p.StockQuantity <= lowStockThreshold ? "Low Stock" : "In Stock"
    }).OrderByDescending(i => i.TotalValue).ToList();

    // Calculate metrics
    report.TotalInventoryValue = report.Items.Sum(i => i.TotalValue);
    report.TotalStockItems = report.Items.Count;
    report.LowStockItems = report.Items.Count(i => i.Status == "Low Stock");

    // Get recent activity (last 30 days)
    var cutoffDate = DateTime.UtcNow.AddDays(-30);
    
    var purchases = await _context.Purchases
        .Where(p => p.PurchaseDate >= cutoffDate)
        .Select(p => new StockMovementDto
        {
            Date = p.PurchaseDate,
            Type = "Purchase",
            Reference = p.InvoiceNumber,
            QuantityChange = p.Quantity,
            NewBalance = p.Product.StockQuantity
        }).ToListAsync();

    var sales = await _context.Sales
        .Include(s => s.Items)
        .Where(s => s.SaleDate >= cutoffDate)
        .SelectMany(s => s.Items.Select(i => new StockMovementDto
        {
            Date = s.SaleDate,
            Type = "Sale",
            Reference = s.InvoiceNumber,
            QuantityChange = -i.Quantity,
            NewBalance = i.Product.StockQuantity
        })).ToListAsync();

    var adjustments = await _context.StockAdjustments
        .Where(a => a.AdjustedAt >= cutoffDate)
        .Select(a => new StockMovementDto
        {
            Date = a.AdjustedAt,
            Type = "Adjustment",
            Reference = $"ADJ-{a.Id}",
            QuantityChange = a.AdjustmentAmount,
            NewBalance = a.Product.StockQuantity
        }).ToListAsync();

    report.RecentActivity = purchases
        .Concat(sales)
        .Concat(adjustments)
        .OrderByDescending(a => a.Date)
        .Take(50) // Top 50 recent
        .ToList();

    return report;
}


// PDF Generation (simplified)
private byte[] GeneratePdfReport(ProfitLossReportDto data)
{
    var document = Document.Create(container =>
    {
        container.Page(page =>
        {
            page.Content().Column(col =>
            {
                col.Item().Text($"P&L Report: {data.StartDate:yyyy-MM-dd} to {data.EndDate:yyyy-MM-dd}");
                col.Item().Text($"Net Profit: {data.NetProfit:C}");
            });
        });
    });

    return document.GeneratePdf();
}

// Excel Generation (simplified)
private MemoryStream GenerateExcelReport(ProfitLossReportDto data)
{
    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("P&L");
    worksheet.Cell("A1").Value = "Net Profit";
    worksheet.Cell("B1").Value = data.NetProfit;
    
    var stream = new MemoryStream();
    workbook.SaveAs(stream);
    stream.Position = 0;
    return stream;
}


private byte[] GenerateExpensesPdfReport(IEnumerable<ExpenseResponseDto> data)
{
    var document = Document.Create(container =>
    {
        container.Page(page =>
        {
            page.Content().Column(col =>
            {
                col.Item().Text("Expenses Report");
                
                // Replace ForEach with foreach
                foreach (var e in data)
                {
                    col.Item().Text($"{e.Date:yyyy-MM-dd} | {e.Type} | {e.Amount:C}");
                }
                
                col.Item().Text($"Total Expenses: {data.Sum(e => e.Amount + e.TaxAmount):C}");
            });
        });
    });

    return document.GeneratePdf();
}

private MemoryStream GenerateExpensesExcelReport(IEnumerable<ExpenseResponseDto> data)
{
    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("Expenses");
    
    // Header
    worksheet.Cell(1, 1).Value = "Date";
    worksheet.Cell(1, 2).Value = "Type";
    worksheet.Cell(1, 3).Value = "Amount";
    worksheet.Cell(1, 4).Value = "Tax";
    worksheet.Cell(1, 5).Value = "Total";

    // Data
    int row = 2;
    foreach (var expense in data)
    {
        worksheet.Cell(row, 1).Value = expense.Date;
        worksheet.Cell(row, 2).Value = expense.Type;
        worksheet.Cell(row, 3).Value = expense.Amount;
        worksheet.Cell(row, 4).Value = expense.TaxAmount;
        worksheet.Cell(row, 5).Value = expense.Amount + expense.TaxAmount;
        row++;
    }

    var stream = new MemoryStream();
    workbook.SaveAs(stream);
    stream.Position = 0;
    return stream;
}

}