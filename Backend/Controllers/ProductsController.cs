namespace Backend.Controllers;
using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                BuyingPrice = p.BuyingPrice,
                SellingPrice = p.SellingPrice,
                Quantity = p.StockQuantity,
                SupplierId = p.SupplierId,
                SupplierName = p.Supplier.Name,
                InventoryManager = p.User.Email
            })
            .ToListAsync();
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Supplier)
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
            Quantity = product.StockQuantity,
            SupplierId = product.SupplierId,
            SupplierName = product.Supplier.Name,
            InventoryManager = product.User.Email
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
            StockQuantity = productDto.Quantity,
            SupplierId = productDto.SupplierId,
            UserId = user!.Id
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            SKU = product.SKU,
            BuyingPrice = product.BuyingPrice,
            SellingPrice = product.SellingPrice,
            Quantity = product.StockQuantity,
            SupplierId = product.SupplierId,
            SupplierName = supplier.Name
        });
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDto productDto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound();

        // Validate SellingPrice > BuyingPrice
        if (productDto.SellingPrice <= product.BuyingPrice)
            return BadRequest("Selling price must be greater than buying price.");

        product.Name = productDto.Name;
        product.SellingPrice = productDto.SellingPrice;
        product.StockQuantity = productDto.Quantity;

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

        if (product == null) return NotFound();
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
            Quantity = product.StockQuantity,
            SupplierId = product.SupplierId,
            SupplierName = product.Supplier.Name
        };
    }
}