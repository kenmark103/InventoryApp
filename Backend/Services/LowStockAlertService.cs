using Backend.Data;
using Microsoft.EntityFrameworkCore;

public class LowStockAlertService : BackgroundService
{
    private readonly ILogger<LowStockAlertService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly int _checkIntervalHours;
    private readonly int _lowStockThreshold;
    private readonly IConfiguration _config;

    


    public LowStockAlertService(
        ILogger<LowStockAlertService> logger,
        IServiceProvider serviceProvider,
        IConfiguration config)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _lowStockThreshold = config.GetValue<int>("LowStockAlert:Threshold");
        _checkIntervalHours = config.GetValue<int>("LowStockAlert:CheckIntervalHours");
        _config = config;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
{
    while (!stoppingToken.IsCancellationRequested)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // Fetch low-stock products
            var lowStockProducts = await dbContext.Products
                .Where(p => p.StockQuantity < _lowStockThreshold)
                .ToListAsync(stoppingToken);

            foreach (var product in lowStockProducts)
            {
                // Avoid duplicate alerts for the same product
                var existingAlert = await dbContext.Notifications
                    .AnyAsync(n => n.ProductId == product.Id && !n.IsRead);

                if (!existingAlert)
                {
                    var notification = new Notification
                    {
                        Message = $"Low stock alert: {product.Name} (SKU: {product.SKU}) has {product.StockQuantity} units remaining.",
                        ProductId = product.Id,
                        CreatedAt = DateTime.UtcNow
                    };

                    dbContext.Notifications.Add(notification);
                }
            }

            await dbContext.SaveChangesAsync(stoppingToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking low stock levels.");
        }

        await Task.Delay(TimeSpan.FromHours(_checkIntervalHours), stoppingToken);
    }
}
}