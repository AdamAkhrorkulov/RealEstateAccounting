using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Domain.Interfaces;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    Task<Customer?> GetCustomerWithContractsAsync(int id);
    Task<IEnumerable<Customer>> SearchCustomersAsync(string searchTerm);
    Task<Customer?> GetByPassportNumberAsync(string passportNumber);
}
