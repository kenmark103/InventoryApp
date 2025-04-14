using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Purchase
    {
        [Key]
        public int Id { get; set; }


        public int ProductId { get; set; }
        public Product Product { get; set; }

        
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; }

        
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        public string? InvoiceNumber { get; set; }
        public string? Notes { get; set; }

        
        
        public int UserId { get; set; }
        public User User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
