namespace Backend.Models

{
	public class Role
	
	{
	    public int Id { get; set; }
	    public string Name { get; set; } // "Cashier", "Admin", etc.
	    public ICollection<RolePermission> RolePermissions { get; set; }
	}
}