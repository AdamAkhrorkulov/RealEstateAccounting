namespace RealEstateAccounting.Application.DTOs;

public class DashboardDto
{
    public DashboardStatsDto Stats { get; set; } = new();
    public List<RevenueDataDto> RevenueData { get; set; } = new();
    public List<AgentPerformanceDto> TopAgents { get; set; } = new();
}

public class DashboardStatsDto
{
    public int TotalApartments { get; set; }
    public int AvailableApartments { get; set; }
    public int SoldApartments { get; set; }
    public int ReservedApartments { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal ReceivedRevenue { get; set; }
    public decimal PendingRevenue { get; set; }
    public decimal OverdueAmount { get; set; }
    public int ActiveContracts { get; set; }
    public int CompletedContracts { get; set; }
    public int OverdueContracts { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalAgents { get; set; }
}

public class RevenueDataDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Payments { get; set; }
}

public class MonthlyRevenueDto
{
    public string Month { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Revenue { get; set; }
    public int ContractsCount { get; set; }
}
