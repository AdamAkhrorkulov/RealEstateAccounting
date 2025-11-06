using RealEstateAccounting.Application.DTOs;

namespace RealEstateAccounting.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardDataAsync();
    Task<List<MonthlyRevenueDto>> GetMonthlyRevenueTrendsAsync(int months);
}
