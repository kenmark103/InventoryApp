using System.Security.Claims;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Helpers;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class PurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAccountingService _acct;

        public PurchaseController(AppDbContext context, IAccountingService acct)
        {
            _context = context;
            _acct = acct;
        }

        // GET: api/purchase (List all)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseResponseDto>>> GetPurchases()
        {
            return await _context.Purchases
                .Include(p => p.Product)
                .Include(p => p.Supplier)
                .Include(p => p.User)
                .Select(p => p.ToDto())
                .ToListAsync();
               
        }

        // GET: api/purchase/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseResponseDto>> GetPurchase(int id)
        {
            var p = await _context.Purchases
                .Include(x => x.Product)
                .Include(x => x.Supplier)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (p == null) return NotFound();

            return p.ToDto();
        }

        // POST: api/purchase
        [HttpPost]
        public async Task<ActionResult<PurchaseResponseDto>> CreatePurchase(PurchaseCreateDto dto)
        {
            // Get current user from JWT
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            var purchase = new Purchase
            {
                ProductId     = dto.ProductId,
                SupplierId    = dto.SupplierId,
                Quantity      = dto.Quantity,
                UnitPrice     = dto.UnitPrice,
                TotalPrice    = dto.TotalPrice,
                PurchaseDate  = dto.PurchaseDate,
                InvoiceNumber = dto.InvoiceNumber,
                Notes         = dto.Notes,
                UserId        = user.Id
            };

            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();

            //update quantity
            var product = await _context.Products.FindAsync(purchase.ProductId);
            product.StockQuantity += purchase.Quantity;

            // load navigation props
            await _context.Entry(purchase).Reference(x => x.Product).LoadAsync();
            await _context.Entry(purchase).Reference(x => x.Supplier).LoadAsync();
            await _context.Entry(purchase).Reference(x => x.User).LoadAsync();

            var result = new PurchaseResponseDto
            {
                Id             = purchase.Id,
                ProductId      = purchase.ProductId,
                ProductName    = purchase.Product.Name,
                SupplierId     = purchase.SupplierId,
                SupplierName   = purchase.Supplier.Name,
                Quantity       = purchase.Quantity,
                UnitPrice      = purchase.UnitPrice,
                TotalPrice     = purchase.TotalPrice,
                PurchaseDate   = purchase.PurchaseDate,
                InvoiceNumber  = purchase.InvoiceNumber,
                Notes          = purchase.Notes,
                CreatedByEmail = purchase.User.Email!,
                CreatedAt      = purchase.CreatedAt
            };

            await _acct.RecordAsync(new AccountTransaction {
                Date = purchase.PurchaseDate,
                Description = $"Purchase #{purchase.Id}",
                Debit = purchase.TotalPrice,
                Credit = 0,
                Account = AccountType.Inventory
            });
            await _acct.RecordAsync(new AccountTransaction {
                Date = purchase.PurchaseDate,
                Description = $"Purchase #{purchase.Id}",
                Debit = 0,
                Credit = purchase.TotalPrice,
                Account = AccountType.AccountsPayable
            });

            return CreatedAtAction(nameof(GetPurchase), new { id = purchase.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePurchase(int id, PurchaseCreateDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var purchase = await _context.Purchases
                    .Include(p => p.Product)
                    .FirstOrDefaultAsync(p => p.Id == id);
                if (purchase == null) return NotFound();

                var product = purchase.Product;
                var oldQuantity = purchase.Quantity;

                product.StockQuantity -= oldQuantity;

                purchase.ProductId = dto.ProductId;
                purchase.SupplierId = dto.SupplierId;
                purchase.Quantity = dto.Quantity;
                purchase.UnitPrice = dto.UnitPrice;
                purchase.TotalPrice = dto.TotalPrice;
                purchase.PurchaseDate = dto.PurchaseDate;
                purchase.InvoiceNumber = dto.InvoiceNumber;
                purchase.Notes = dto.Notes;

                // Apply new stock
                product.StockQuantity += dto.Quantity;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // DELETE: api/purchase/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var purchase = await _context.Purchases
                    .Include(p => p.Product)
                    .FirstOrDefaultAsync(p => p.Id == id);
                if (purchase == null) return NotFound();

                // Revert stock
                purchase.Product.StockQuantity -= purchase.Quantity;

                _context.Purchases.Remove(purchase);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
