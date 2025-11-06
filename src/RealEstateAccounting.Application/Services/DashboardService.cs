using AutoMapper;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;
using RealEstateAccounting.Domain.Enums;
using RealEstateAccounting.Domain.Interfaces;

namespace RealEstateAccounting.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IAgentService _agentService;

    public DashboardService(IUnitOfWork unitOfWork, IMapper mapper, IAgentService agentService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _agentService = agentService;
    }

    public async Task<DashboardDto> GetDashboardDataAsync()
    {
        // Get apartment statistics
        var allApartments = (await _unitOfWork.Apartments.GetAllAsync()).ToList();
        var totalApartments = allApartments.Count;
        var soldApartments = allApartments.Count(a => a.Status == ApartmentStatus.Sold);
        var availableApartments = allApartments.Count(a => a.Status == ApartmentStatus.Available);

        // Get revenue statistics
        var allContracts = (await _unitOfWork.Contracts.GetAllAsync()).ToList();
        var totalRevenue = allContracts.Sum(c => c.TotalAmount);
        var totalReceived = await _unitOfWork.Payments.GetTotalPaymentsAsync();
        var totalPending = totalRevenue - totalReceived;

        // Get monthly revenue
        var currentMonthStart = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
        var currentMonthEnd = currentMonthStart.AddMonths(1).AddDays(-1);
        var monthlyRevenue = await _unitOfWork.Payments.GetTotalPaymentsAsync(currentMonthStart, currentMonthEnd);

        // Get overdue contracts
        var overdueContracts = await _unitOfWork.Contracts.GetOverdueContractsAsync();
        var overdueCount = overdueContracts.Count();

        // Get top performing agents
        var topAgents = await _agentService.GetTopPerformingAgentsAsync(5);

        // Get monthly trends
        var monthlyTrends = await GetMonthlyRevenueTrendsAsync(12);

        // Get recent contracts
        var recentContracts = allContracts
            .OrderByDescending(c => c.ContractDate)
            .Take(10)
            .ToList();

        return new DashboardDto
        {
            TotalApartments = totalApartments,
            ApartmentsSold = soldApartments,
            ApartmentsAvailable = availableApartments,
            TotalRevenue = totalReceived,
            TotalPending = totalPending,
            MonthlyRevenue = monthlyRevenue,
            OverdueContracts = overdueCount,
            TopAgents = topAgents.ToList(),
            MonthlyTrends = monthlyTrends,
            RecentContracts = _mapper.Map<List<ContractDto>>(recentContracts)
        };
    }

    public async Task<List<MonthlyRevenueDto>> GetMonthlyRevenueTrendsAsync(int months)
    {
        var trends = new List<MonthlyRevenueDto>();
        var currentDate = DateTime.UtcNow;

        for (int i = months - 1; i >= 0; i--)
        {
            var targetDate = currentDate.AddMonths(-i);
            var monthStart = new DateTime(targetDate.Year, targetDate.Month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var revenue = await _unitOfWork.Payments.GetTotalPaymentsAsync(monthStart, monthEnd);
            var contracts = (await _unitOfWork.Contracts.GetAllAsync())
                .Count(c => c.ContractDate >= monthStart && c.ContractDate <= monthEnd);

            trends.Add(new MonthlyRevenueDto
            {
                Month = monthStart.ToString("MMMM"),
                Year = monthStart.Year,
                Revenue = revenue,
                ContractsCount = contracts
            });
        }

        return trends;
    }
}
