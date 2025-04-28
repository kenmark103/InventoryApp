namespace Backend.Constants
{
    public static class Permissions
    {
        // Product-related
        public const string ViewProducts = "ViewProducts";
        public const string EditProducts = "EditProducts";
        public const string DeleteProducts = "DeleteProducts";
        
        // Sales
        public const string ProcessSales = "ProcessSales";
        public const string ViewSalesHistory = "ViewSalesHistory";
        
        // User Management
        public const string ViewUsers = "ViewUsers";
        public const string ManageUsers = "ManageUsers";
        
        // Roles & Permissions
        public const string ManageRoles = "ManageRoles";
        public const string AssignPermissions = "AssignPermissions";
        
        // System
        public const string AllAccess = "AllAccess";
    }
}