namespace Backend.Dtos
{
    
    public class RoleCreateDto
    {
        public string Name { get; set; }
        public List<string> PermissionNames { get; set; }
    }
}