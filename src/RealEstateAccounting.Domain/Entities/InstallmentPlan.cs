namespace RealEstateAccounting.Domain.Entities;

public class InstallmentPlan : BaseEntity
{
    public int CompanyId { get; set; }  // Multi-tenancy: Each installment plan belongs to one company
    public int ContractId { get; set; }
    public int MonthNumber { get; set; }  // Месяц по счету (1, 2, 3...)
    public DateTime DueDate { get; set; }  // Срок оплаты
    public decimal ScheduledAmount { get; set; }  // Сумма по графику
    public bool IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }
    public int? PaymentId { get; set; }  // ID платежа

    // Navigation properties
    public Contract Contract { get; set; } = null!;
    public Payment? Payment { get; set; }

    // Calculated property
    public bool IsOverdue => !IsPaid && DueDate < DateTime.UtcNow;
}
