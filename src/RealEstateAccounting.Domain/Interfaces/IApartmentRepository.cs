using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Domain.Interfaces;

public interface IApartmentRepository : IGenericRepository<Apartment>
{
    Task<IEnumerable<Apartment>> GetAvailableApartmentsAsync();
    Task<IEnumerable<Apartment>> GetApartmentsByBlockAsync(string block);
    Task<IEnumerable<Apartment>> GetApartmentsByStatusAsync(ApartmentStatus status);
    Task<Apartment?> GetApartmentWithContractAsync(int id);
}
