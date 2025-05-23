using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace Backend.Controllers;
using System.Text.Json;
using Backend.Models;


[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public UsersController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    // Register a new user (Admin only)
    [HttpPost("register")]
    [Authorize(Roles = "Admin")] // Only admins can register new users
    public async Task<ActionResult<User>> Register(UserRegisterDto request)
    {
        // Check if email exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email already exists.");

        // Hash password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            FirstName = request.FirstName ?? string.Empty,  // If the request provides a first name, use it; otherwise, default to an empty string.
            LastName = request.LastName ?? string.Empty,    
            Username = request.Username ?? string.Empty,   
            PhoneNumber = request.PhoneNumber ?? string.Empty, // Optional phone number
            Status = request.Status ?? "Active"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    // Login and generate JWT
    [HttpPost("login")]
    public async Task<ActionResult> Login(UserLoginDto request)
    {
        // Find user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            return Unauthorized("Invalid credentials.");

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");

        // Generate JWT token
        var token = GenerateJwtToken(user);
        var response = new
            {
                Token = token,
                User = new
                {
                    user.Username,
                    user.Email,
                    user.Role // Assuming 'Roles' is a collection of user's roles
                }
            };

        return Ok(response);
    
    }

    // Get all users (Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    // Get user by ID (Admin or self)
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        // Allow access if user is Admin or requesting their own data
        if (User.IsInRole("Admin") || user.Email == currentUserEmail)
            return Ok(user);

        return Unauthorized();
    }

        [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult> GetCurrentUser()
    {
        // Get current user's email from the token
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        
        // Find user in database
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == userEmail);
        
        if (user == null)
            return NotFound();

        return Ok(new {
            user.Id,
            user.Email,
            user.Role,
            user.FirstName,
            user.LastName,
            user.Username
        });
    }

    //update user 

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(int id, UserUpdateDto updateDto)
    {

        var currentUserEmail = User.FindFirstValue(ClaimTypes.Email);
        
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Allow update if the user is an Admin or updating their own data.
        if (!User.IsInRole("Admin") && user.Email != currentUserEmail)
        {
            return Unauthorized("You do not have permission to update this user.");
        }

        // Update user fields if new values are provided.
        user.FirstName = updateDto.FirstName ?? user.FirstName;
        user.LastName = updateDto.LastName ?? user.LastName;
        user.Username = updateDto.Username ?? user.Username;
        user.PhoneNumber = updateDto.PhoneNumber ?? user.PhoneNumber;
        
        // Optionally update additional fields here.
        
        // Update the 'UpdatedAt' timestamp.
        user.UpdatedAt = DateTime.UtcNow;

        // Save changes.
        _context.Entry(user).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent(); // 204 No Content is a common response for successful PUT updates.
    }

    // Delete user (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Helper: Generate JWT token
    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryInMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}