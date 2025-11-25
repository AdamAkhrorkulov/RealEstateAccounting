using Microsoft.AspNetCore.Identity;
using RealEstateAccounting.Application.Interfaces;
using RealEstateAccounting.Infrastructure.Identity;

namespace RealEstateAccounting.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<string> GetUserFullNameAsync(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            return "Unknown";

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return "Unknown";

        // Return FullName if available, otherwise return UserName, otherwise Email
        if (!string.IsNullOrEmpty(user.FullName))
            return user.FullName;

        if (!string.IsNullOrEmpty(user.UserName))
            return user.UserName;

        if (!string.IsNullOrEmpty(user.Email))
            return user.Email;

        return "Unknown";
    }
}
