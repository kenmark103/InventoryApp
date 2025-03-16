using System.ComponentModel.DataAnnotations;

public class SaleStatusUpdateDto
{
    [Required]
    public SaleStatus Status { get; set; }
}