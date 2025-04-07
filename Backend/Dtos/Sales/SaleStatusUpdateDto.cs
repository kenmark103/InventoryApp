using System.ComponentModel.DataAnnotations;
using Backend.Models;

public class SaleStatusUpdateDto
{
    [Required]
    public SaleStatus Status { get; set; }
}
