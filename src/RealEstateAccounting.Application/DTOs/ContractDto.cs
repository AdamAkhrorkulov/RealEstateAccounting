using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Application.DTOs;

public class ContractDto
{
    public int Id { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public DateTime ContractDate { get; set; }
    public int CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int ApartmentId { get; set; }
    public string ApartmentInfo { get; set; } = string.Empty;
    public int AgentId { get; set; }
    public string AgentName { get; set; } = string.Empty;
    public int DurationMonths { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DownPayment { get; set; }
    public decimal MonthlyPayment { get; set; }
    public ContractStatus Status { get; set; }
    public decimal RemainingBalance { get; set; }
    public int MonthsPaid { get; set; }
    public int MonthsRemaining { get; set; }

    // Navigation properties
    public CustomerDto? Customer { get; set; }
    public ApartmentDto? Apartment { get; set; }
    public AgentDto? Agent { get; set; }
}

public class CreateContractDto
{
    public DateTime ContractDate { get; set; }
    public int DurationMonths { get; set; }
    public decimal DownPayment { get; set; }
    public int CustomerId { get; set; }
    public int ApartmentId { get; set; }
    public int AgentId { get; set; }
}

public class UpdateContractDto
{
    public ContractStatus Status { get; set; }
    public decimal DownPayment { get; set; }
    public int DurationMonths { get; set; }
}

public class ContractDetailsDto : ContractDto
{
    public List<PaymentDto> Payments { get; set; } = new();
    public List<InstallmentPlanDto> InstallmentPlans { get; set; } = new();
}
