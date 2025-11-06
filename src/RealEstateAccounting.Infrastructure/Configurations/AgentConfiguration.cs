using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Infrastructure.Configurations;

public class AgentConfiguration : IEntityTypeConfiguration<Agent>
{
    public void Configure(EntityTypeBuilder<Agent> builder)
    {
        builder.ToTable("Agents");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.FullName)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.PhoneNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(a => a.Email)
            .HasMaxLength(100);

        builder.Property(a => a.CommissionPercentage)
            .HasPrecision(5, 2);

        builder.Property(a => a.TotalCommissionEarned)
            .HasPrecision(18, 2);

        builder.HasIndex(a => a.Email)
            .IsUnique();
    }
}
