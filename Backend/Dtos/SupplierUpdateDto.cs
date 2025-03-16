using System.ComponentModel.DataAnnotations;

public class SupplierUpdateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string ContactInfo { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;
}