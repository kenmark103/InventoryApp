using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<SalesController> _logger;

        public SalesController(AppDbContext context, IConfiguration config, ILogger<SalesController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        // POST: api/sales (Create a new sale with line items)
        [HttpPost]
        public async Task<ActionResult<SaleResponseDto>> CreateSale(SaleCreateDto dto)
        {
            // Validate customer
            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null) 
                return BadRequest("Invalid customer");

            // Get current user (salesperson)
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if(user == null)
                return BadRequest("User not found");

            var sale = new Sale
            {
                CustomerId = dto.CustomerId,
                UserId = user.Id,
                Notes = dto.Notes,
                PaymentMethod = dto.PaymentMethod,
                DueDate = dto.DueDate,
                Discount = dto.Discount,
                Status = SaleStatus.DRAFT, // Will change to "Paid" if payment succeeds
                Items = new List<SaleItem>()

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
                if (product == null)
                    return BadRequest($"Product {itemDto.ProductId} not found");

                // Check stock (if physical product)
                if (!product.IsService && product.StockQuantity < itemDto.Quantity)
                    return BadRequest($"Insufficient stock for {product.Name}");

                var saleItem = new SaleItem
                {
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = itemDto.Price ?? product.SellingPrice,
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

            
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return Ok(MapToResponseDto(sale));
        }


        // POST: api/sales/{id}/complete (Finalize sale with payment)
        [HttpPost("{id}/complete")]
        public async Task<ActionResult<SaleResponseDto>> CompleteSale(
            int id, 
            [FromBody] SaleCompleteRequestDto dto)
        {
            var sale = await _context.Sales
                .Include(s => s.CompletedSale) // Include completed sale if exists
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null) return NotFound();
            if (sale.Status != SaleStatus.DRAFT) 
                return BadRequest("Only draft sales can be completed");

            // Process payment
            var (success, transactionId) = MockProcessPayment(dto.PaymentDetails);
            if (!success) return BadRequest("Payment failed");

            // Create CompletedSale
            var completedSale = new CompletedSale
            {
                SaleId = sale.Id,
                PaymentMethod = dto.PaymentDetails.Method,
                TransactionId = transactionId,
                AmountTendered = dto.PaymentDetails.AmountTendered,
                ChangeDue = dto.PaymentDetails.ChangeDue
            };

            // Update sale status
            sale.Status = SaleStatus.COMPLETED;
            sale.CompletedSale = completedSale;

            await _context.SaveChangesAsync();
            return Ok(MapToResponseDto(sale));
        }

        private (bool success, string transactionId) MockProcessPayment(PaymentDetailsDto details)
        {
            // Generate fake transaction ID based on method
            var transactionId = $"{details.Method}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString()[..6]}";
            
            // Simulate 2-second processing delay
            Thread.Sleep(2000);
            
            // Always return success for testing
            return (true, transactionId);
        }

        // GET: api/sales (Get all sales)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetSales()
        {
            var sales = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.User)
                .Include(s => s.Items)
                    .ThenInclude(i => i.Product)
                .ToListAsync();

            var response = sales.Select(s => MapToResponseDto(s)).ToList();
            return Ok(response);
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

            if (sale == null)
                return NotFound();

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

            if (sale == null)
                return NotFound();

            // Validate transition
            if (!IsValidStatusTransition(sale.Status, dto.Status))
                return BadRequest($"Invalid status transition: {sale.Status} → {dto.Status}");

            // Restock products if refunding
            if (dto.Status == SaleStatus.REFUNDED)
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

        //Get receipt
        [HttpGet("{id}/receipt")]
        [Authorize(Roles = "Accounting,Manager")]
        public async Task<ActionResult<SaleReceiptDto>> GetSaleReceipt(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.CompletedSale)  // Now pointing to the CompletedSale entity
                .Include(s => s.Customer)
                .Include(s => s.Items)
                    .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale?.CompletedSale == null)
                return NotFound("Receipt not available for incomplete sales");

            return Ok(MapToReceiptDto(sale));
        }


            private SaleReceiptDto MapToReceiptDto(Sale sale)
        {
            var baseDto = MapToResponseDto(sale); // Reuse base mapping
            
            return new SaleReceiptDto
            {
                // Base properties
                Id = baseDto.Id,
                InvoiceNumber = baseDto.InvoiceNumber,
                Status = baseDto.Status,
                // ... other inherited properties ...

                // Receipt-specific properties
                PaymentInfo = new CompletedSaleDto
                {
                    PaymentMethod = sale.CompletedSale.PaymentMethod,
                    TransactionId = sale.CompletedSale.TransactionId ?? "CASH",
                    AmountTendered = sale.CompletedSale.AmountTendered,
                    ChangeDue = sale.CompletedSale.ChangeDue
                },
                ReceiptNumber = $"RCPT-{sale.InvoiceNumber}",
                PaymentDate = sale.CompletedSale.CompletedDate // Add this field to CompletedSale
            };
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
                }).ToList(),
        
                CompletedSale = sale.CompletedSale != null ? new CompletedSaleDto
                {
                    PaymentMethod = sale.CompletedSale.PaymentMethod,
                    TransactionId = sale.CompletedSale.TransactionId ?? "n/a",
                    AmountTendered = sale.CompletedSale.AmountTendered,
                    ChangeDue = sale.CompletedSale.ChangeDue
                } : null
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
                [SaleStatus.DRAFT] = new() { SaleStatus.HOLD, SaleStatus.REFUNDED },
                [SaleStatus.HOLD] = new() { SaleStatus.PAID, SaleStatus.REFUNDED },
                [SaleStatus.PAID] = new() { SaleStatus.COMPLETED, SaleStatus.REFUNDED },
                [SaleStatus.COMPLETED] = new() { SaleStatus.REFUNDED },
                [SaleStatus.REFUNDED] = new() { }
            };

            return allowedTransitions[currentStatus].Contains(newStatus);
        }
    }
}


