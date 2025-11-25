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
        var reservedApartments = allApartments.Count(a => a.Status == ApartmentStatus.Reserved);

        // Get contract statistics
        var allContracts = (await _unitOfWork.Contracts.GetAllAsync()).ToList();
        var activeContracts = allContracts.Count(c => c.Status == ContractStatus.Active);
        var completedContracts = allContracts.Count(c => c.Status == ContractStatus.Completed);
        var overdueContractsCount = allContracts.Count(c => c.Status == ContractStatus.Overdue);

        // Get revenue statistics
        var totalRevenue = allContracts.Sum(c => c.TotalAmount);
        var receivedRevenue = await _unitOfWork.Payments.GetTotalPaymentsAsync();
        var pendingRevenue = totalRevenue - receivedRevenue;

        // Calculate overdue amount
        var overdueContracts = await _unitOfWork.Contracts.GetOverdueContractsAsync();
        var overdueAmount = overdueContracts.Sum(c => c.RemainingBalance);

        // Get customer and agent counts
        var totalCustomers = (await _unitOfWork.Customers.GetAllAsync()).Count();
        var totalAgents = (await _unitOfWork.Agents.GetAllAsync()).Count();

        // Get top performing agents
        var topAgents = await _agentService.GetTopPerformingAgentsAsync(5);

        // Get monthly revenue trends
        var revenueData = new List<RevenueDataDto>();
        var currentDate = DateTime.UtcNow;

        for (int i = 11; i >= 0; i--)
        {
            var targetDate = currentDate.AddMonths(-i);
            var monthStart = new DateTime(targetDate.Year, targetDate.Month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var monthRevenue = await _unitOfWork.Payments.GetTotalPaymentsAsync(monthStart, monthEnd);
            var monthPayments = (await _unitOfWork.Payments.GetAllAsync())
                .Count(p => p.PaymentDate >= monthStart && p.PaymentDate <= monthEnd);

            revenueData.Add(new RevenueDataDto
            {
                Month = monthStart.ToString("MMM yyyy"),
                Revenue = monthRevenue,
                Payments = monthPayments
            });
        }

        return new DashboardDto
        {
            Stats = new DashboardStatsDto
            {
                TotalApartments = totalApartments,
                AvailableApartments = availableApartments,
                SoldApartments = soldApartments,
                ReservedApartments = reservedApartments,
                TotalRevenue = totalRevenue,
                ReceivedRevenue = receivedRevenue,
                PendingRevenue = pendingRevenue,
                OverdueAmount = overdueAmount,
                ActiveContracts = activeContracts,
                CompletedContracts = completedContracts,
                OverdueContracts = overdueContractsCount,
                TotalCustomers = totalCustomers,
                TotalAgents = totalAgents
            },
            RevenueData = revenueData,
            TopAgents = topAgents.ToList()
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
