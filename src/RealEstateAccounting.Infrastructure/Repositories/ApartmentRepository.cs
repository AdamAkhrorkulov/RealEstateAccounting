using Microsoft.EntityFrameworkCore;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class ApartmentRepository : GenericRepository<Apartment>, IApartmentRepository
{
    public ApartmentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Apartment>> GetAvailableApartmentsAsync()
    {
        return await _dbSet
            .Where(a => a.Status == ApartmentStatus.Available)
            .OrderBy(a => a.Block)
            .ThenBy(a => a.Entrance)
            .ThenBy(a => a.Floor)
            .ToListAsync();
    }

    public async Task<IEnumerable<Apartment>> GetApartmentsByBlockAsync(string block)
    {
        return await _dbSet
            .Where(a => a.Block == block)
            .OrderBy(a => a.Entrance)
            .ThenBy(a => a.Floor)
            .ToListAsync();
    }

    public async Task<IEnumerable<Apartment>> GetApartmentsByStatusAsync(ApartmentStatus status)
    {
        return await _dbSet
            .Where(a => a.Status == status)
            .ToListAsync();
    }

    public async Task<Apartment?> GetApartmentWithContractAsync(int id)
    {
        return await _dbSet
            .Include(a => a.Contract)
            .ThenInclude(c => c!.Customer)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}
