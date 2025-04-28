namespace Backend.Models
{
	public class Permission
	{
	    public int Id { get; set; }
	    public string Name { get; set; } // e.g., "ManageProducts", "CreateUser"
	    public ICollection<RolePermission> RolePermissions { get; set; }
	}
}