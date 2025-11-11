using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Domain.Entities;

public class Payment : BaseEntity
{
    public int ContractId { get; set; }
    public int? InstallmentPlanId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentType PaymentType { get; set; }  // нал / без.нал
    public string Notes { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public string RecordedByUserName { get; set; } = string.Empty;  // Name of person who recorded payment

    // Foreign Keys
    public string RecordedByUserId { get; set; } = string.Empty;  // Who recorded the payment

    // Navigation properties
    public Contract Contract { get; set; } = null!;
    public InstallmentPlan? InstallmentPlan { get; set; }
}
