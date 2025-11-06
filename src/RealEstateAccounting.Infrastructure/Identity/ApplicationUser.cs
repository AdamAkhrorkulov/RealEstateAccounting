using Microsoft.AspNetCore.Identity;
using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public int? AgentId { get; set; }  // Link to Agent entity if user is an agent
    public int? CustomerId { get; set; }  // Link to Customer entity if user is a customer
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
