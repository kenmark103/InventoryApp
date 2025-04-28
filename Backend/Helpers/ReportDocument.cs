using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Backend.Dtos;
namespace Backend.Helpers;

public class ReportDocument : IDocument
{
    private readonly ProfitLossReportDto _data;

    public ReportDocument(ProfitLossReportDto data)
    {
        _data = data;
    }

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(30);
            page.Content().Column(col =>
            {
                col.Item().Text($"P&L Report: {_data.StartDate:yyyy-MM-dd} to {_data.EndDate:yyyy-MM-dd}")
                    .FontSize(18).Bold();
                col.Item().Text($"Net Profit: {_data.NetProfit:C}")
                    .FontSize(14);
            });
        });
    }
}
