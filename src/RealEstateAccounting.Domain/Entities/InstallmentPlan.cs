namespace RealEstateAccounting.Domain.Entities;

public class InstallmentPlan : BaseEntity
{
    public int ContractId { get; set; }
    public int MonthNumber { get; set; }  // Месяц по счету (1, 2, 3...)
    public DateTime DueDate { get; set; }  // Срок оплаты
    public decimal ScheduledAmount { get; set; }  // Сумма по графику
    public bool IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }

    // Navigation properties
    public Contract Contract { get; set; } = null!;
    public Payment? Payment { get; set; }

    // Calculated property
    public bool IsOverdue => !IsPaid && DueDate < DateTime.UtcNow;
}
