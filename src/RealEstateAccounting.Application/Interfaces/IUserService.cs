namespace RealEstateAccounting.Application.Interfaces;

public interface IUserService
{
    Task<string> GetUserFullNameAsync(string userId);
}
