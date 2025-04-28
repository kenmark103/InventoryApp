using System.Security.Claims;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Dtos;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/roles
    [HttpGet]
    public IActionResult GetRoles()
    {
        var roles = _context.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .ToList();
        
        return Ok(roles);
    }

    // POST: api/roles
    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] RoleCreateDto roleDto)
    {
        var role = new Role
        {
            Name = roleDto.Name,
            RolePermissions = roleDto.PermissionNames.Select(pn => new RolePermission
            {
                Permission = _context.Permissions.FirstOrDefault(p => p.Name == pn)
            }).ToList()
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoles), role);
    }
}

