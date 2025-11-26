using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Domain.Entities;

public class Apartment : BaseEntity
{
    public int CompanyId { get; set; }  // Multi-tenancy: Each apartment belongs to one company
    public string ApartmentNumber { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public int Entrance { get; set; }  // Подъезд
    public int Floor { get; set; }
    public int RoomCount { get; set; }  // Количество комнат
    public decimal Area { get; set; }  // Площадь
    public decimal PricePerSquareMeter { get; set; }
    public decimal TotalPrice { get; set; }
    public ApartmentStatus Status { get; set; }

    // Navigation properties
    public Contract? Contract { get; set; }
}
