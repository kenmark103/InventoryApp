using System.ComponentModel.DataAnnotations;

public class CategoryCreateDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    public string? Description { get; set; }

    public string Status { get; set; } = "active";
}
