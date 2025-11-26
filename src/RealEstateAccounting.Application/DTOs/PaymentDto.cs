using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Application.DTOs;

public class PaymentDto
{
    public int Id { get; set; }
    public int CompanyId { get; set; }  // Multi-tenancy
    public int ContractId { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public int? InstallmentPlanId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentType PaymentType { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public string RecordedByUserId { get; set; } = string.Empty;
    public string RecordedByUserName { get; set; } = string.Empty;
}

public class CreatePaymentDto
{
    public int ContractId { get; set; }
    public int? InstallmentPlanId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public PaymentType PaymentType { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string ReceiptNumber { get; set; } = string.Empty;
    public string RecordedByUserName { get; set; } = string.Empty;
}

public class PaymentReportDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalCash { get; set; }
    public decimal TotalNonCash { get; set; }
    public decimal GrandTotal { get; set; }
    public List<PaymentDto> Payments { get; set; } = new();
}
