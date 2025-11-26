using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Application.DTOs;

public class ApartmentDto
{
    public int Id { get; set; }
    public int CompanyId { get; set; }  // Multi-tenancy
    public string ApartmentNumber { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public int Entrance { get; set; }
    public int Floor { get; set; }
    public int RoomCount { get; set; }
    public decimal Area { get; set; }
    public decimal PricePerSquareMeter { get; set; }
    public decimal TotalPrice { get; set; }
    public ApartmentStatus Status { get; set; }
}

public class CreateApartmentDto
{
    public string ApartmentNumber { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public int Entrance { get; set; }
    public int Floor { get; set; }
    public int RoomCount { get; set; }
    public decimal Area { get; set; }
    public decimal PricePerSquareMeter { get; set; }
}

public class UpdateApartmentDto
{
    public string ApartmentNumber { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public int Entrance { get; set; }
    public int Floor { get; set; }
    public int RoomCount { get; set; }
    public decimal Area { get; set; }
    public decimal PricePerSquareMeter { get; set; }
    public ApartmentStatus Status { get; set; }
}
