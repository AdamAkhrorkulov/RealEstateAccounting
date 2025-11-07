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

        builder.Property(c => c.PassportSeries)
            .IsRequired()
            .HasMaxLength(2);

        builder.Property(c => c.PassportNumber)
            .IsRequired()
            .HasMaxLength(10);

        builder.Property(c => c.PassportIssueDate)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.PassportIssuedBy)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.RegistrationAddress)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(c => c.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(c => c.Email)
            .HasMaxLength(100);

        // Composite unique index for passport series + number
        builder.HasIndex(c => new { c.PassportSeries, c.PassportNumber })
            .IsUnique();

        builder.HasIndex(c => c.PhoneNumber);
    }
}
