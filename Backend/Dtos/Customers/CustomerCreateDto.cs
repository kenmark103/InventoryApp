using System.ComponentModel.DataAnnotations;

public class CustomerCreateDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [EmailAddress, StringLength(100)]
    public string? Email { get; set; }

    [Phone, StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(200)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? Company { get; set; }
}