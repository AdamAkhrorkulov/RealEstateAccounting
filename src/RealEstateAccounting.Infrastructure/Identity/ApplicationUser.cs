using Microsoft.AspNetCore.Identity;
using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Admin;  // All users are Admins
    public int CompanyId { get; set; }  // Multi-tenancy: Each user belongs to one company/business
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
