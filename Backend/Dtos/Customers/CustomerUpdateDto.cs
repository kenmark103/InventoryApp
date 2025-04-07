using System.ComponentModel.DataAnnotations;

public class CustomerUpdateDto
{
    [StringLength(100)]
    public string? Name { get; set; }

    [EmailAddress, StringLength(100)]
    public string? Email { get; set; }

    // ... include other fields as optional
}