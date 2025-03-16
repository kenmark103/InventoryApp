namespace Backend.Controllers;
using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,InventoryManager")] // Restrict to Admins & Inventory Managers
public class SuppliersController : ControllerBase
{
    private readonly AppDbContext _context;

    public SuppliersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/suppliers (List all suppliers)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
    {
        return await _context.Suppliers.ToListAsync();
    }

    // GET: api/suppliers/5 (Get supplier by ID)
    [HttpGet("{id}")]
    public async Task<ActionResult<Supplier>> GetSupplier(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null)
            return NotFound();

        return supplier;
    }

    // POST: api/suppliers (Add new supplier)
    [HttpPost]
    public async Task<ActionResult<Supplier>> CreateSupplier(SupplierCreateDto supplierDto)
    {
        // Check for duplicate supplier name
        if (await _context.Suppliers.AnyAsync(s => s.Name == supplierDto.Name))
            return BadRequest("Supplier name already exists.");

        // Get current user from JWT token
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

        var supplier = new Supplier
        {
            Name = supplierDto.Name,
            ContactInfo = supplierDto.ContactInfo,
            Address = supplierDto.Address,
            AddedByUserId = user!.Id // Track who added the supplier
        };

        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, supplier);
    }

    // PUT: api/suppliers/5 (Update supplier)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, SupplierUpdateDto supplierDto)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null)
            return NotFound();

        supplier.Name = supplierDto.Name;
        supplier.ContactInfo = supplierDto.ContactInfo;
        supplier.Address = supplierDto.Address;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/suppliers/5 (Delete supplier - Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSupplier(int id)
    {
        var supplier = await _context.Suppliers.FindAsync(id);
        if (supplier == null)
            return NotFound();

        // Prevent deletion if supplier has products
        if (await _context.Products.AnyAsync(p => p.SupplierId == id))
            return BadRequest("Supplier has associated products and cannot be deleted.");

        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}