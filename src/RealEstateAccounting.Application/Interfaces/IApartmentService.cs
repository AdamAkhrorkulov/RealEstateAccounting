using RealEstateAccounting.Application.DTOs;

namespace RealEstateAccounting.Application.Interfaces;

public interface IApartmentService
{
    Task<ApartmentDto> CreateApartmentAsync(CreateApartmentDto dto);
    Task<ApartmentDto> GetApartmentByIdAsync(int id);
    Task<IEnumerable<ApartmentDto>> GetAllApartmentsAsync();
    Task<IEnumerable<ApartmentDto>> GetAvailableApartmentsAsync();
    Task<IEnumerable<ApartmentDto>> GetApartmentsByBlockAsync(string block);
    Task<ApartmentDto> UpdateApartmentAsync(int id, UpdateApartmentDto dto);
    Task<bool> DeleteApartmentAsync(int id);
}
