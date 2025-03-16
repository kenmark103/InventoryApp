namespace Backend.Controllers;
using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

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

        return new ProfitLossReportDto
        {
            StartDate = startDate,
            EndDate = endDate,
            TotalRevenue = totalRevenue,
            CostOfGoodsSold = cogs,
            TotalExpenses = totalExpenses,
            ExpenseByCategory = expenseByCategory,
            RevenueByProduct = revenueByProduct
        };
    }

    [HttpGet("cash-flow")]
public async Task<ActionResult<CashFlowReportDto>> GetCashFlowReport(
    [FromQuery] DateTime startDate,
    [FromQuery] DateTime endDate)
{
    // Cash from sales (assuming immediate payment)
    var sales = await _context.Sales
        .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate)
        .ToListAsync();
    var cashFromSales = sales.Sum(s => s.Total);

    // Cash for expenses (approved expenses)
    var expenses = await _context.Expenses
        .Where(e => e.Date >= startDate && e.Date <= endDate && e.Status == "Approved")
        .ToListAsync();
    var cashForExpenses = expenses.Sum(e => e.Amount + e.TaxAmount);

    // Cash for purchases (product buying costs)
    var purchases = await _context.Products
        .Where(p => p.CreatedAt >= startDate && p.CreatedAt <= endDate)
        .ToListAsync();
    var cashForPurchases = purchases.Sum(p => p.BuyingPrice * p.StockQuantity);

    return new CashFlowReportDto
    {
        StartDate = startDate,
        EndDate = endDate,
        CashFromSales = cashFromSales,
        OtherIncome = 0, // Customize if needed
        CashForExpenses = cashForExpenses,
        CashForPurchases = cashForPurchases
    };
}

[HttpGet("balance-sheet")]
public async Task<ActionResult<BalanceSheetDto>> GetBalanceSheet()
{
    // Assets
    var cashBalance = await _context.Sales.SumAsync(s => s.Total) 
                    - await _context.Expenses.SumAsync(e => e.Amount + e.TaxAmount);
    var inventoryValue = await _context.Products
        .SumAsync(p => p.BuyingPrice * p.StockQuantity);

    // Liabilities (unpaid expenses)
    var accountsPayable = await _context.Expenses
        .Where(e => e.Status == "Pending")
        .SumAsync(e => e.Amount + e.TaxAmount);

    return new BalanceSheetDto
    {
        ReportDate = DateTime.UtcNow,
        CashBalance = cashBalance,
        InventoryValue = inventoryValue,
        AccountsPayable = accountsPayable,
        RetainedEarnings = cashBalance // Simplified for example
    };
}

[HttpGet("export")]
public async Task<IActionResult> ExportReport(
    [FromQuery] DateTime startDate,
    [FromQuery] DateTime endDate,
    [FromQuery] string format = "pdf") // pdf/excel
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

}