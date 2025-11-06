namespace RealEstateAccounting.Domain.Entities;

public class Customer : BaseEntity
{
    public string FullName { get; set; } = string.Empty;  // ФИО
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;  // Паспорт с пропиской
    public string PassportIssuedBy { get; set; } = string.Empty;
    public DateTime PassportIssuedDate { get; set; }
    public string Address { get; set; } = string.Empty;
    public string AdditionalContacts { get; set; } = string.Empty;  // Контакты

    // Navigation properties
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
