namespace RealEstateAccounting.Domain.Entities;

public class Customer : BaseEntity
{
    public int CompanyId { get; set; }  // Multi-tenancy: Each customer belongs to one company
    public string FullName { get; set; } = string.Empty;  // ФИО
    public string PassportSeries { get; set; } = string.Empty;  // Серия паспорта
    public string PassportNumber { get; set; } = string.Empty;  // Номер паспорта
    public string PassportIssueDate { get; set; } = string.Empty;  // Дата выдачи
    public string PassportIssuedBy { get; set; } = string.Empty;  // Кем выдан
    public string RegistrationAddress { get; set; } = string.Empty;  // Адрес прописки
    public string PhoneNumber { get; set; } = string.Empty;  // Телефон
    public string Email { get; set; } = string.Empty;  // Email (optional)

    // Navigation properties
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
