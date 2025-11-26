using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Domain.Entities;

public class Contract : BaseEntity
{
    public int CompanyId { get; set; }  // Multi-tenancy: Each contract belongs to one company
    public string ContractNumber { get; set; } = string.Empty;  // № договора
    public DateTime ContractDate { get; set; }  // Дата договора
    public int DurationMonths { get; set; }  // Срок (месяцы)
    public decimal TotalAmount { get; set; }  // Сумма договоров
    public decimal DownPayment { get; set; }  // Первоначальный взнос
    public decimal MonthlyPayment { get; set; }  // Сумма по графику
    public ContractStatus Status { get; set; }

    // Foreign Keys
    public int CustomerId { get; set; }
    public int ApartmentId { get; set; }
    public int AgentId { get; set; }

    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public Apartment Apartment { get; set; } = null!;
    public Agent Agent { get; set; } = null!;
    public ICollection<InstallmentPlan> InstallmentPlans { get; set; } = new List<InstallmentPlan>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();

    // Calculated properties (not stored in DB)
    public decimal RemainingBalance => TotalAmount - Payments.Sum(p => p.Amount);
    public int MonthsPaid => Payments.Count(p => p.IsPaid);
    public int MonthsRemaining => DurationMonths - MonthsPaid;
}
