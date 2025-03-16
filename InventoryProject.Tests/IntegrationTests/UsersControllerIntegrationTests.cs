using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Headers;
using System.Net;
using System.Text;
using System.Text.Json;

[Trait("Category", "Integration")]
public class UsersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public UsersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            // Override database to use in-memory
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDb");
                });
            });
        });
        _client = _factory.CreateClient();
    }

    // Test 1: Full registration → login → get user flow
    [Fact]
    public async Task Register_Login_GetUser_Success()
    {
        // Step 1: Register (as Admin)
        var adminToken = await GetAdminToken();
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", adminToken);

        var registerResponse = await _client.PostAsJsonAsync("/api/users/register", new
        {
            Email = "user@test.com",
            Password = "password",
            Role = "User"
        });
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        // Step 2: Login as new user
        var loginResponse = await _client.PostAsJsonAsync("/api/users/login", new
        {
            Email = "user@test.com",
            Password = "password"
        });
        var loginData = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
        var userToken = loginData.GetProperty("Token").GetString();

        // Step 3: Get user details
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", userToken);
        var userResponse = await _client.GetAsync("/api/users/1"); // Assuming ID=1
        Assert.Equal(HttpStatusCode.OK, userResponse.StatusCode);
    }

    // Test 2: Unauthorized access to GetUsers
    [Fact]
    public async Task GetUsers_WithoutAdminToken_Unauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // Helper: Get admin token for setup
    private async Task<string> GetAdminToken()
    {
        // Seed admin user
        var admin = new User
        {
            Email = "admin@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("adminpass"),
            Role = "Admin"
        };
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Users.Add(admin);
        await db.SaveChangesAsync();

        // Login as admin
        var response = await _client.PostAsJsonAsync("/api/users/login", new
        {
            Email = "admin@test.com",
            Password = "adminpass"
        });
        var data = await response.Content.ReadFromJsonAsync<JsonElement>();
        return data.GetProperty("Token").GetString();
    }
}