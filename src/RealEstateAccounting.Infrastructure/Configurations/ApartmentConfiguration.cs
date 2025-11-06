using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Infrastructure.Configurations;

public class ApartmentConfiguration : IEntityTypeConfiguration<Apartment>
{
    public void Configure(EntityTypeBuilder<Apartment> builder)
    {
        builder.ToTable("Apartments");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.ApartmentNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.Block)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(a => a.Area)
            .HasPrecision(18, 2);

        builder.Property(a => a.PricePerSquareMeter)
            .HasPrecision(18, 2);

        builder.Property(a => a.TotalPrice)
            .HasPrecision(18, 2);

        builder.HasIndex(a => a.ApartmentNumber)
            .IsUnique();

        builder.HasIndex(a => new { a.Block, a.Entrance, a.Floor })
            .HasDatabaseName("IX_Apartment_Location");
    }
}
