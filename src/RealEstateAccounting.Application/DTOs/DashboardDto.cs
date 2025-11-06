namespace RealEstateAccounting.Application.DTOs;

public class DashboardDto
{
    public int TotalApartments { get; set; }
    public int ApartmentsSold { get; set; }
    public int ApartmentsAvailable { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalPending { get; set; }
    public decimal MonthlyRevenue { get; set; }
    public int OverdueContracts { get; set; }
    public List<AgentPerformanceDto> TopAgents { get; set; } = new();
    public List<MonthlyRevenueDto> MonthlyTrends { get; set; } = new();
    public List<ContractDto> RecentContracts { get; set; } = new();
}

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Revenue { get; set; }
    public int ContractsCount { get; set; }
}
