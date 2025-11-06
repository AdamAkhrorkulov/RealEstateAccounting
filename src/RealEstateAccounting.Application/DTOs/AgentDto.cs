namespace RealEstateAccounting.Application.DTOs;

public class AgentDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal CommissionPercentage { get; set; }
    public decimal TotalCommissionEarned { get; set; }
    public int TotalSales { get; set; }
}

public class CreateAgentDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal CommissionPercentage { get; set; }
}

public class UpdateAgentDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal CommissionPercentage { get; set; }
}

public class AgentPerformanceDto
{
    public int AgentId { get; set; }
    public string AgentName { get; set; } = string.Empty;
    public int TotalSales { get; set; }
    public decimal TotalCommission { get; set; }
    public decimal TotalRevenue { get; set; }
}
