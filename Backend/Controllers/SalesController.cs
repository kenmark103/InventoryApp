namespace Backend.Controllers;
using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public SalesController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // POST: api/sales (Create a new sale with line items)
    [HttpPost]
    public async Task<ActionResult<SaleResponseDto>> CreateSale(SaleCreateDto dto)
    {
        // Validate customer
        var customer = await _context.Customers.FindAsync(dto.CustomerId);
        if (customer == null) return BadRequest("Invalid customer");

        // Get current user (salesperson)
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

        var sale = new Sale
        {
            CustomerId = dto.CustomerId,
            UserId = user!.Id,
            Notes = dto.Notes,
            PaymentMethod = dto.PaymentMethod,
            DueDate = dto.DueDate,
            Discount = dto.Discount,
            Status = SaleStatus.Draft // Will change to "Paid" if payment succeeds
        };

        // Generate invoice number (e.g., INV-2024-001)
        var lastInvoice = await _context.Sales
            .OrderByDescending(s => s.Id)
            .FirstOrDefaultAsync();
        sale.InvoiceNumber = GenerateInvoiceNumber(lastInvoice?.InvoiceNumber);

        // Process line items
        foreach (var itemDto in dto.Items)
        {
            var product = await _context.Products.FindAsync(itemDto.ProductId);
            if (product == null) return BadRequest($"Product {itemDto.ProductId} not found");

            // Check stock (if physical product)
            if (!product.IsService && product.StockQuantity < itemDto.Quantity)
                return BadRequest($"Insufficient stock for {product.Name}");

            var saleItem = new SaleItem
            {
                ProductId = itemDto.ProductId,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.PriceOverride ?? product.SellingPrice,
                TaxRate = product.TaxRate
            };

            sale.Items.Add(saleItem);
            sale.Subtotal += saleItem.UnitPrice * saleItem.Quantity;
            sale.TaxAmount += saleItem.UnitPrice * saleItem.Quantity * saleItem.TaxRate;

            // Deduct stock (if applicable)
            if (!product.IsService)
                product.StockQuantity -= itemDto.Quantity;
        }

        // Apply discount (assuming flat discount)
        sale.Subtotal -= sale.Discount;

        // Handle payment (simplified – integrate Stripe/PayPal in real app)
        if (dto.PaymentMethod != "Credit")
            sale.Status = SaleStatus.Paid; // Auto-mark as paid for cash/bank transfers

        _context.Sales.Add(sale);
        await _context.SaveChangesAsync();

        return Ok(MapToResponseDto(sale));
    }

    // GET: api/sales/{id} (Get sale details)
    [HttpGet("{id}")]
    public async Task<ActionResult<SaleResponseDto>> GetSale(int id)
    {
        var sale = await _context.Sales
            .Include(s => s.Customer)
            .Include(s => s.User)
            .Include(s => s.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale == null) return NotFound();

        return Ok(MapToResponseDto(sale));
    }

    // PUT: api/sales/{id}/status (Update status – e.g., mark as shipped)
    [HttpPut("{id}/status")]
public async Task<IActionResult> UpdateSaleStatus(int id, [FromBody] SaleStatusUpdateDto dto)
{
    var sale = await _context.Sales
        .Include(s => s.Items)
            .ThenInclude(i => i.Product)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (sale == null) return NotFound();

    // Validate transition
    if (!IsValidStatusTransition(sale.Status, dto.Status))
        return BadRequest($"Invalid status transition: {sale.Status} → {dto.Status}");

    // Restock products if refunding
    if (dto.Status == SaleStatus.Refunded)
    {
        foreach (var item in sale.Items)
        {
            item.Product.StockQuantity += item.Quantity; // Restore stock
        }
    }

    sale.Status = dto.Status;
    await _context.SaveChangesAsync();

    return NoContent();
}

    // Helper: Map Sale to SaleResponseDto
    private SaleResponseDto MapToResponseDto(Sale sale)
    {
        return new SaleResponseDto
        {
            Id = sale.Id,
            InvoiceNumber = sale.InvoiceNumber,
            SaleDate = sale.SaleDate,
            Status = sale.Status.ToString(),
            PaymentMethod = sale.PaymentMethod,
            Subtotal = sale.Subtotal,
            TaxAmount = sale.TaxAmount,
            Discount = sale.Discount,
            Total = sale.Total,
            CustomerName = sale.Customer.Name,
            ProcessedBy = sale.User.Email,
            Items = sale.Items.Select(i => new SaleItemResponseDto
            {
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TaxRate = i.TaxRate
            }).ToList()
        };
    }

    // Helper: Generate invoice numbers (e.g., INV-2024-001)
    private string GenerateInvoiceNumber(string? lastInvoiceNumber)
    {
        if (string.IsNullOrEmpty(lastInvoiceNumber))
            return $"INV-{DateTime.UtcNow.Year}-001";

        var parts = lastInvoiceNumber.Split('-');
        var year = int.Parse(parts[1]);
        var seq = int.Parse(parts[2]);

        if (year != DateTime.UtcNow.Year)
            return $"INV-{DateTime.UtcNow.Year}-001";
        else
            return $"INV-{year}-{(seq + 1):D3}";
    }

    private bool IsValidStatusTransition(SaleStatus currentStatus, SaleStatus newStatus)
{
    var allowedTransitions = new Dictionary<SaleStatus, List<SaleStatus>>
    {
        [SaleStatus.Draft] =     new() { SaleStatus.Paid, SaleStatus.Refunded }, // Allow direct refund for cancellations
        [SaleStatus.Paid] =      new() { SaleStatus.Shipped, SaleStatus.Refunded },
        [SaleStatus.Shipped] =   new() { SaleStatus.Delivered, SaleStatus.Refunded },
        [SaleStatus.Delivered] = new() { SaleStatus.Refunded },
        [SaleStatus.Refunded] =  new() { }
    };

    return allowedTransitions[currentStatus].Contains(newStatus);
}
}