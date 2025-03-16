using Microsoft.EntityFrameworkCore;

namespace Backend.Data; // Replace with your namespace
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User ↔ Product (Inventory Manager adds products)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Products)
            .WithOne(p => p.User)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Supplier ↔ Product (One-to-Many)
        modelBuilder.Entity<Supplier>()
            .HasMany(s => s.Products)
            .WithOne(p => p.Supplier)
            .HasForeignKey(p => p.SupplierId)
            .OnDelete(DeleteBehavior.Restrict);

        // User ↔ Expense (Accountant submits expenses)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Expenses)
            .WithOne(e => e.User)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // User ↔ Sale (Sales personnel record sales)
        modelBuilder.Entity<User>()
            .HasMany(u => u.Sales)
            .WithOne(s => s.User)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Sale ↔ Customer (Customer's sales)
        modelBuilder.Entity<Sale>()
            .HasOne(s => s.Customer)
            .WithMany(c => c.Sales)
            .HasForeignKey(s => s.CustomerId);

        // SaleItem ↔ Sale
        modelBuilder.Entity<SaleItem>()
            .HasOne(si => si.Sale)
            .WithMany(s => s.Items)
            .HasForeignKey(si => si.SaleId);

        // SaleItem ↔ Product
        modelBuilder.Entity<SaleItem>()
            .HasOne(si => si.Product)
            .WithMany(p => p.SaleItems)
            .HasForeignKey(si => si.ProductId);

        // Indexes for faster lookups
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Email)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .HasIndex(p => p.Name)
            .IsUnique();

        // Supplier ↔ User (Who added the supplier)
        modelBuilder.Entity<Supplier>()
            .HasOne(s => s.AddedByUser)
            .WithMany() // A user can add multiple suppliers
            .HasForeignKey(s => s.AddedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Notification ↔ Product
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Product)
            .WithMany()
            .HasForeignKey(n => n.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed initial user data
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Email = "admin@example.com",
                PasswordHash = "$2a$10$IuP/6aPlX.RzmEvcLN6MSefRrS1WV7EJUDB.4TN66FHYm6WeblH8q", // Hashed password for admin123
                Role = "Admin",
                IsEmailVerified = true,
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
