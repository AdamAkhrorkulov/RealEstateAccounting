using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Infrastructure.Configurations;

public class ContractConfiguration : IEntityTypeConfiguration<Contract>
{
    public void Configure(EntityTypeBuilder<Contract> builder)
    {
        builder.ToTable("Contracts");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.ContractNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(c => c.TotalAmount)
            .HasPrecision(18, 2);

        builder.Property(c => c.DownPayment)
            .HasPrecision(18, 2);

        builder.Property(c => c.MonthlyPayment)
            .HasPrecision(18, 2);

        builder.HasIndex(c => c.ContractNumber)
            .IsUnique();

        builder.HasIndex(c => c.ContractDate);

        // Relationships
        builder.HasOne(c => c.Customer)
            .WithMany(cu => cu.Contracts)
            .HasForeignKey(c => c.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Apartment)
            .WithOne(a => a.Contract)
            .HasForeignKey<Contract>(c => c.ApartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Agent)
            .WithMany(a => a.Contracts)
            .HasForeignKey(c => c.AgentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Ignore calculated properties
        builder.Ignore(c => c.RemainingBalance);
        builder.Ignore(c => c.MonthsPaid);
        builder.Ignore(c => c.MonthsRemaining);
    }
}
