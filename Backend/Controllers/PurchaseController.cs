using System.Security.Claims;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Manager")]
    public class PurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PurchaseController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/purchase (List all)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PurchaseResponseDto>>> GetPurchases()
        {
            return await _context.Purchases
                .Include(p => p.Product)
                .Include(p => p.Supplier)
                .Include(p => p.User)
                .Select(p => new PurchaseResponseDto
                {
                    Id             = p.Id,
                    ProductId      = p.ProductId,
                    ProductName    = p.Product.Name,
                    SupplierId     = p.SupplierId,
                    SupplierName   = p.Supplier.Name,
                    Quantity       = p.Quantity,
                    UnitPrice      = p.UnitPrice,
                    TotalPrice     = p.TotalPrice,
                    PurchaseDate   = p.PurchaseDate,
                    InvoiceNumber  = p.InvoiceNumber,
                    Notes          = p.Notes,
                    CreatedByEmail = p.User.Email,
                    CreatedAt      = p.CreatedAt
                })
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

            return new PurchaseResponseDto
            {
                Id             = p.Id,
                ProductId      = p.ProductId,
                ProductName    = p.Product.Name,
                SupplierId     = p.SupplierId,
                SupplierName   = p.Supplier.Name,
                Quantity       = p.Quantity,
                UnitPrice      = p.UnitPrice,
                TotalPrice     = p.TotalPrice,
                PurchaseDate   = p.PurchaseDate,
                InvoiceNumber  = p.InvoiceNumber,
                Notes          = p.Notes,
                CreatedByEmail = p.User.Email,
                CreatedAt      = p.CreatedAt
            };
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

            return CreatedAtAction(nameof(GetPurchase), new { id = purchase.Id }, result);
        }

        // PUT: api/purchase/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePurchase(int id, PurchaseCreateDto dto)
        {
            var purchase = await _context.Purchases.FindAsync(id);
            if (purchase == null) return NotFound();

            purchase.ProductId     = dto.ProductId;
            purchase.SupplierId    = dto.SupplierId;
            purchase.Quantity      = dto.Quantity;
            purchase.UnitPrice     = dto.UnitPrice;
            purchase.TotalPrice    = dto.TotalPrice;
            purchase.PurchaseDate  = dto.PurchaseDate;
            purchase.InvoiceNumber = dto.InvoiceNumber;
            purchase.Notes         = dto.Notes;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/purchase/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            var purchase = await _context.Purchases.FindAsync(id);
            if (purchase == null) return NotFound();

            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
