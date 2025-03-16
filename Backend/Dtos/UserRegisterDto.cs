using System.ComponentModel.DataAnnotations;
namespace Backend.DTOs;

public class UserRegisterDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User"; // Default role: User
}