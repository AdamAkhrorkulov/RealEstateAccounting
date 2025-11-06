using AutoMapper;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Interfaces;

namespace RealEstateAccounting.Application.Services;

public class ApartmentService : IApartmentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ApartmentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApartmentDto> CreateApartmentAsync(CreateApartmentDto dto)
    {
        var apartment = _mapper.Map<Apartment>(dto);
        await _unitOfWork.Apartments.AddAsync(apartment);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ApartmentDto>(apartment);
    }

    public async Task<ApartmentDto> GetApartmentByIdAsync(int id)
    {
        var apartment = await _unitOfWork.Apartments.GetByIdAsync(id);
        if (apartment == null)
            throw new ArgumentException("Apartment not found");

        return _mapper.Map<ApartmentDto>(apartment);
    }

    public async Task<IEnumerable<ApartmentDto>> GetAllApartmentsAsync()
    {
        var apartments = await _unitOfWork.Apartments.GetAllAsync();
        return _mapper.Map<IEnumerable<ApartmentDto>>(apartments);
    }

    public async Task<IEnumerable<ApartmentDto>> GetAvailableApartmentsAsync()
    {
        var apartments = await _unitOfWork.Apartments.GetAvailableApartmentsAsync();
        return _mapper.Map<IEnumerable<ApartmentDto>>(apartments);
    }

    public async Task<IEnumerable<ApartmentDto>> GetApartmentsByBlockAsync(string block)
    {
        var apartments = await _unitOfWork.Apartments.GetApartmentsByBlockAsync(block);
        return _mapper.Map<IEnumerable<ApartmentDto>>(apartments);
    }

    public async Task<ApartmentDto> UpdateApartmentAsync(int id, UpdateApartmentDto dto)
    {
        var apartment = await _unitOfWork.Apartments.GetByIdAsync(id);
        if (apartment == null)
            throw new ArgumentException("Apartment not found");

        _mapper.Map(dto, apartment);
        apartment.TotalPrice = apartment.Area * apartment.PricePerSquareMeter;

        await _unitOfWork.Apartments.UpdateAsync(apartment);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ApartmentDto>(apartment);
    }

    public async Task<bool> DeleteApartmentAsync(int id)
    {
        var apartment = await _unitOfWork.Apartments.GetByIdAsync(id);
        if (apartment == null)
            return false;

        await _unitOfWork.Apartments.DeleteAsync(apartment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
