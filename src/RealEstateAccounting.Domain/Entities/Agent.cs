namespace RealEstateAccounting.Domain.Entities;

public class Agent : BaseEntity
{
    public int CompanyId { get; set; }  // Multi-tenancy: Each agent belongs to one company
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal CommissionPercentage { get; set; }
    public decimal TotalCommissionEarned { get; set; }
    public int TotalSales { get; set; }

    // Navigation properties
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
