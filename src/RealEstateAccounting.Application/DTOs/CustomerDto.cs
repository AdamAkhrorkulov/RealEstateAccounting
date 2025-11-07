namespace RealEstateAccounting.Application.DTOs;

public class CustomerDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PassportSeries { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;
    public string PassportIssueDate { get; set; } = string.Empty;
    public string PassportIssuedBy { get; set; } = string.Empty;
    public string RegistrationAddress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateCustomerDto
{
    public string FullName { get; set; } = string.Empty;
    public string PassportSeries { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;
    public string PassportIssueDate { get; set; } = string.Empty;
    public string PassportIssuedBy { get; set; } = string.Empty;
    public string RegistrationAddress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class UpdateCustomerDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string AdditionalContacts { get; set; } = string.Empty;
}
