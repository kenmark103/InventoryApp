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
    [Authorize(Roles = "Admin,InventoryManager")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;
    
        public ProductsController(AppDbContext context)
        {
            _context = context;
        }
    
        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts()
        {
            return await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.User)
                .Include(p => p.Category)
                .Include(p => p.GalleryImages)
                .Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    SKU = p.SKU,
                    BuyingPrice = p.BuyingPrice,
                    SellingPrice = p.SellingPrice,
                    TaxRate = p.TaxRate,
                    IsService = p.IsService,
                    Quantity = p.StockQuantity,
                    SupplierId = p.SupplierId,
                    SupplierName = p.Supplier.Name,
                    InventoryManager = p.User.Email,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    ImageUrl = p.ImageUrl,
                    Description = p.Description,
                    // Map gallery images to a list of image URLs
                    GalleryImages = p.GalleryImages.Select(gi => gi.ImageUrl).ToList(),
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();
        }
    
        // GET: api/products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.User)
                .Include(p => p.Category)
                .Include(p => p.GalleryImages) // Include gallery images
                .FirstOrDefaultAsync(p => p.Id == id);
    
            if (product == null)
                return NotFound();
    
            return new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                SKU = product.SKU,
                BuyingPrice = product.BuyingPrice,
                SellingPrice = product.SellingPrice,
                TaxRate = product.TaxRate,
                IsService = product.IsService,
                Quantity = product.StockQuantity,
                SupplierId = product.SupplierId,
                SupplierName = product.Supplier.Name,
                InventoryManager = product.User.Email,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
                GalleryImages = product.GalleryImages.Select(gi => gi.ImageUrl).ToList(),
                CreatedAt = product.CreatedAt
            };
        }
    
        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<ProductResponseDto>> CreateProduct(ProductCreateDto productDto)
        {
            // Validate Supplier exists
            var supplier = await _context.Suppliers.FindAsync(productDto.SupplierId);
            if (supplier == null)
                return BadRequest("Invalid Supplier ID.");
    
            // Check SKU uniqueness
            if (await _context.Products.AnyAsync(p => p.SKU == productDto.SKU))
                return BadRequest("SKU already exists.");
    
            // Validate SellingPrice > BuyingPrice
            if (productDto.SellingPrice <= productDto.BuyingPrice)
                return BadRequest("Selling price must be greater than buying price.");
    
            // Get current user from JWT
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
    
            var product = new Product
            {
                Name = productDto.Name,
                SKU = productDto.SKU,
                BuyingPrice = productDto.BuyingPrice,
                SellingPrice = productDto.SellingPrice,
                TaxRate = productDto.TaxRate,
                IsService = productDto.IsService,
                StockQuantity = productDto.Quantity,
                SupplierId = productDto.SupplierId,
                CategoryId = productDto.CategoryId,
                ImageUrl = productDto.ImageUrl,
                Description = productDto.Description,
                UserId = user!.Id,
                GalleryImages = new List<ProductImage>()
            };
    
            // Map gallery images if provided
            if (productDto.GalleryImages != null && productDto.GalleryImages.Any())
            {
                product.GalleryImages = productDto.GalleryImages
                    .Select(url => new ProductImage { ImageUrl = url })
                    .ToList();
            }
    
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
    
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                SKU = product.SKU,
                BuyingPrice = product.BuyingPrice,
                SellingPrice = product.SellingPrice,
                TaxRate = product.TaxRate,
                IsService = product.IsService,
                Quantity = product.StockQuantity,
                SupplierId = product.SupplierId,
                SupplierName = supplier.Name,
                InventoryManager = user.Email,
                CategoryId = product.CategoryId,
                CategoryName = _context.Categories.Find(product.CategoryId)?.Name ?? string.Empty,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
                GalleryImages = product.GalleryImages.Select(gi => gi.ImageUrl).ToList(),
                CreatedAt = product.CreatedAt
            });
        }
    
        // PUT: api/products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDto productDto)
        {
            var product = await _context.Products
                .Include(p => p.GalleryImages)
                .FirstOrDefaultAsync(p => p.Id == id);
    
            if (product == null)
                return NotFound();
    
            // Validate SellingPrice > BuyingPrice remains unchanged:
            if (productDto.SellingPrice <= product.BuyingPrice)
                return BadRequest("Selling price must be greater than buying price.");
    
            product.Name = productDto.Name;
            product.SKU = productDto.SKU;
            product.BuyingPrice = productDto.BuyingPrice;
            product.SellingPrice = productDto.SellingPrice;
            product.TaxRate = productDto.TaxRate;
            product.IsService = productDto.IsService;
            product.StockQuantity = productDto.Quantity;
            product.SupplierId = productDto.SupplierId;
            product.CategoryId = productDto.CategoryId;
            product.ImageUrl = productDto.ImageUrl;
            product.Description = productDto.Description;
    
            // Update gallery images if provided:
            if (productDto.GalleryImages != null)
            {
                // Remove all existing gallery images
                _context.RemoveRange(product.GalleryImages);
                // Assign new gallery images
                product.GalleryImages = productDto.GalleryImages
                    .Select(url => new ProductImage { ImageUrl = url, ProductId = product.Id })
                    .ToList();
            }
    
            await _context.SaveChangesAsync();
            return NoContent();
        }
    
        // DELETE: api/products/5 (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.SaleItems)
                .FirstOrDefaultAsync(p => p.Id == id);
    
            if (product == null)
                return NotFound();
    
            if (product.SaleItems.Any())
                return BadRequest("Product has sales history and cannot be deleted.");
    
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
    
            return NoContent();
        }
    
        // GET: api/products/sku/{sku} (Barcode lookup)
        [HttpGet("sku/{sku}")]
        public async Task<ActionResult<ProductResponseDto>> GetProductBySku(string sku)
        {
            var product = await _context.Products
                .Include(p => p.Supplier)
                .Include(p => p.User)
                .Include(p => p.Category)
                .Include(p => p.GalleryImages)
                .FirstOrDefaultAsync(p => p.SKU == sku);
    
            if (product == null)
                return NotFound();
    
            return new ProductResponseDto
            {
                Id = product.Id,
                Name = product.Name,
                SKU = product.SKU,
                BuyingPrice = product.BuyingPrice,
                SellingPrice = product.SellingPrice,
                TaxRate = product.TaxRate,
                IsService = product.IsService,
                Quantity = product.StockQuantity,
                SupplierId = product.SupplierId,
                SupplierName = product.Supplier.Name,
                InventoryManager = product.User.Email,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                ImageUrl = product.ImageUrl,
                Description = product.Description,
                GalleryImages = product.GalleryImages.Select(gi => gi.ImageUrl).ToList(),
                CreatedAt = product.CreatedAt
            };
        }
    }
}
