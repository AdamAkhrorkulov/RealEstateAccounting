namespace RealEstateAccounting.Application.DTOs;

public class InstallmentPlanDto
{
    public int Id { get; set; }
    public int ContractId { get; set; }
    public int MonthNumber { get; set; }
    public DateTime DueDate { get; set; }
    public decimal ScheduledAmount { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaidDate { get; set; }
    public bool IsOverdue { get; set; }
}
