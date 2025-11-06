using Microsoft.EntityFrameworkCore;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Customer?> GetCustomerWithContractsAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Contracts)
            .ThenInclude(con => con.Apartment)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Customer>> SearchCustomersAsync(string searchTerm)
    {
        return await _dbSet
            .Where(c => c.FullName.Contains(searchTerm) ||
                       c.PhoneNumber.Contains(searchTerm) ||
                       c.PassportNumber.Contains(searchTerm))
            .ToListAsync();
    }

    public async Task<Customer?> GetByPassportNumberAsync(string passportNumber)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.PassportNumber == passportNumber);
    }
}
