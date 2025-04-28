using Microsoft.EntityFrameworkCore;
using Backend.Models; // Ensure this using statement is present

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<AccountTransaction> AccountTransactions { get; set; }
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<StockAdjustment> StockAdjustments { get; set; }

    
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
    
            // Category ↔ Product (One-to-Many)
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);
    
            // Configure Product ↔ ProductImage (One-to-Many)
            modelBuilder.Entity<Product>()
                .HasMany(p => p.GalleryImages)
                .WithOne(pi => pi.Product)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
    
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

          modelBuilder.Entity<Sale>()
                .HasOne(s => s.CompletedSale)
                .WithOne(cs => cs.Sale)
                .HasForeignKey<CompletedSale>(cs => cs.SaleId);
            
            // Sale ↔ Customer (Customer's sales)
            modelBuilder.Entity<Sale>()
                .HasOne(s => s.Customer)
                .WithMany(c => c.Sales)
                .HasForeignKey(s => s.CustomerId);

            modelBuilder.Entity<Sale>()
                .Property(s => s.Status)
                .HasConversion<string>();
            
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
                .WithMany()
                .HasForeignKey(s => s.AddedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
    
            // Notification ↔ Product
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Product)
                .WithMany()
                .HasForeignKey(n => n.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.Product)
                .WithMany()
                .HasForeignKey(p => p.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.Supplier)
                .WithMany()
                .HasForeignKey(p => p.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Purchase>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Role-Permission many-to-many
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });
            
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);
            
            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            modelBuilder.Entity<AccountTransaction>()
            .HasIndex(t => new { t.Date, t.Account });

            modelBuilder.Entity<Loan>(entity =>
            {
                entity.Property(l => l.Amount)
                    .HasColumnType("decimal(18,2)");
            });

            // Investment configuration 
            modelBuilder.Entity<Investment>(entity =>
            {
                entity.Property(i => i.Amount)
                    .HasColumnType("decimal(18,2)");
            });


            modelBuilder.Entity<StockAdjustment>()
                .HasOne(sa => sa.Product)
                .WithMany(p => p.StockAdjustments)
                .HasForeignKey(sa => sa.ProductId);

                   
            
            
            // Seed initial user data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@example.com",
                    FirstName = "Admin",
                    LastName = "User",
                    Username = "admin",
                    PhoneNumber = "000-000-0000",
                    Status = "Active",
                    PasswordHash = "$2a$10$IuP/6aPlX.RzmEvcLN6MSefRrS1WV7EJUDB.4TN66FHYm6WeblH8q", // Hashed password for admin123
                    Role = "Admin",
                    IsEmailVerified = true,
                    CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
