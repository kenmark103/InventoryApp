using System.ComponentModel.DataAnnotations;

public class ExpenseUpdateDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // Approved/Rejected
}