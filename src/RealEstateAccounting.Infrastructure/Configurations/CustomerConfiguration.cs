using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Infrastructure.Configurations;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.Email)
            .HasMaxLength(100);

        builder.Property(c => c.PassportNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.PassportIssuedBy)
            .HasMaxLength(200);

        builder.Property(c => c.Address)
            .HasMaxLength(500);

        builder.Property(c => c.AdditionalContacts)
            .HasMaxLength(500);

        builder.HasIndex(c => c.PassportNumber)
            .IsUnique();

        builder.HasIndex(c => c.PhoneNumber);
    }
}
