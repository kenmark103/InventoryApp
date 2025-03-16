using Moq;
using Xunit;
using Backend.Data;
using Backend.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

[Trait("Category", "Unit")]
public class UsersControllerUnitTests
{
    private readonly Mock<AppDbContext> _mockContext = new();
    private readonly Mock<IConfiguration> _mockConfig = new();
    private readonly UsersController _controller;

    public UsersControllerUnitTests()
    {
        // Mock JWT settings
        _mockConfig.Setup(c => c["Jwt:Key"]).Returns("fake_key_here");
        _controller = new UsersController(_mockContext.Object, _mockConfig.Object);
    }

    // Test 1: Admin can register a user
    [Fact]
    public async Task Register_AdminUser_Success()
    {
        // Arrange
        var mockUsers = new Mock<DbSet<User>>();
        _mockContext.Setup(c => c.Users).Returns(mockUsers.Object);
        _controller.SetUserClaims("Admin", "admin@test.com"); // Use TestHelpers

        // Act
        var result = await _controller.Register(new UserRegisterDto 
        { 
            Email = "user@test.com", 
            Password = "password", 
            Role = "User" 
        });

        // Assert
        Assert.IsType<OkObjectResult>(result.Result);
        mockUsers.Verify(m => m.Add(It.IsAny<User>()), Times.Once);
    }

    // Test 2: Registration with existing email fails
    [Fact]
    public async Task Register_ExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var existingUser = new User { Email = "user@test.com" };
        var mockUsers = MockDbSet(new List<User> { existingUser });
        _mockContext.Setup(c => c.Users).Returns(mockUsers.Object);
        _controller.SetUserClaims("Admin", "admin@test.com");

        // Act
        var result = await _controller.Register(new UserRegisterDto 
        { 
            Email = "user@test.com", 
            Password = "password", 
            Role = "User" 
        });

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    // Test 3: Non-admin cannot list users
    [Fact]
    public async Task GetUsers_NonAdmin_Unauthorized()
    {
        // Arrange
        _controller.SetUserClaims("User", "user@test.com");

        // Act
        var result = await _controller.GetUsers();

        // Assert
        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    // Helper: Mock DbSet
    private static Mock<DbSet<User>> MockDbSet(List<User> users)
    {
        var queryable = users.AsQueryable();
        var mockSet = new Mock<DbSet<User>>();
        mockSet.As<IQueryable<User>>().Setup(m => m.Provider).Returns(queryable.Provider);
        mockSet.As<IQueryable<User>>().Setup(m => m.Expression).Returns(queryable.Expression);
        return mockSet;
    }
}