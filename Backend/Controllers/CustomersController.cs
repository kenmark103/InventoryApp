namespace Backend.Controllers;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/customers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerResponseDto>>> GetCustomers(
        [FromQuery] string? searchTerm = null)
    {
        var query = _context.Customers.AsQueryable();

        // Optional search by name/email/company
        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(c =>
                c.Name.Contains(searchTerm) ||
                c.Email!.Contains(searchTerm) ||
                c.Company!.Contains(searchTerm)
            );
        }

        return await query
            .Select(c => new CustomerResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Company = c.Company,
                CreatedAt = c.CreatedAt,
                TotalSales = c.Sales.Count
            })
            .ToListAsync();
    }

    // GET: api/customers/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerResponseDto>> GetCustomer(int id)
    {
        var customer = await _context.Customers
            .Include(c => c.Sales)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null) return NotFound();

        return new CustomerResponseDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            Company = customer.Company,
            CreatedAt = customer.CreatedAt,
            TotalSales = customer.Sales.Count
        };
    }

    // POST: api/customers
    [HttpPost]
    public async Task<ActionResult<CustomerResponseDto>> CreateCustomer(CustomerCreateDto dto)
    {
        // Validate email uniqueness (if provided)
        if (!string.IsNullOrEmpty(dto.Email))
        {
            var existingCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == dto.Email);
            if (existingCustomer != null)
                return Conflict("Email already in use by another customer.");
        }

        var customer = new Customer
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            Company = dto.Company
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, MapToDto(customer));
    }

    // PUT: api/customers/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, CustomerUpdateDto dto)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        // Update only provided fields
        if (!string.IsNullOrEmpty(dto.Name))
            customer.Name = dto.Name!;

        if (dto.Email != null)
        {
            // Validate email uniqueness
            var existingCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == dto.Email && c.Id != id);
            if (existingCustomer != null)
                return Conflict("Email already in use by another customer.");
            customer.Email = dto.Email;
        }

        // ... update other fields similarly

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/customers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers
            .Include(c => c.Sales)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null) return NotFound();

        // Prevent deletion if customer has sales history
        if (customer.Sales.Any())
            return BadRequest("Cannot delete customer with existing sales.");

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private CustomerResponseDto MapToDto(Customer customer)
    {
        return new CustomerResponseDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email,
            Phone = customer.Phone,
            Company = customer.Company,
            CreatedAt = customer.CreatedAt,
            TotalSales = customer.Sales.Count
        };
    }
}