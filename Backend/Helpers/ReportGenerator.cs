// Helpers/PdfReportGenerator.cs
using QuestPDF.Fluent;
using ClosedXML.Excel;
using Backend.Dtos;

namespace Backend.Helpers;

public static class PdfReportGenerator
{
    public static byte[] GenerateExpensesReport(IEnumerable<ExpenseResponseDto> expenses)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Content().Column(col =>
                {
                    col.Item().Text("Expenses Report");
                    foreach (var e in expenses)
                    {
                        col.Item().Text($"{e.Date:yyyy-MM-dd} | {e.Type} | {e.Amount:C}");
                    }
                    col.Item().Text($"Total: {expenses.Sum(e => e.Amount + e.TaxAmount):C}");
                });
            });
        }).GeneratePdf();
    }
}


public static class ExcelReportGenerator
{
    public static MemoryStream GenerateExpensesReport(IEnumerable<ExpenseResponseDto> expenses)
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
        foreach (var e in expenses)
        {
            worksheet.Cell(row, 1).Value = e.Date;
            worksheet.Cell(row, 2).Value = e.Type;
            worksheet.Cell(row, 3).Value = e.Amount;
            worksheet.Cell(row, 4).Value = e.TaxAmount;
            worksheet.Cell(row, 5).Value = e.Amount + e.TaxAmount;
            row++;
        }

        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }
}