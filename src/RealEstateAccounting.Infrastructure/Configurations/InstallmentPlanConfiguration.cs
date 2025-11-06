using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Infrastructure.Configurations;

public class InstallmentPlanConfiguration : IEntityTypeConfiguration<InstallmentPlan>
{
    public void Configure(EntityTypeBuilder<InstallmentPlan> builder)
    {
        builder.ToTable("InstallmentPlans");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.ScheduledAmount)
            .HasPrecision(18, 2);

        builder.HasIndex(i => new { i.ContractId, i.MonthNumber })
            .IsUnique()
            .HasDatabaseName("IX_InstallmentPlan_Contract_Month");

        builder.HasIndex(i => i.DueDate);

        // Relationships
        builder.HasOne(i => i.Contract)
            .WithMany(c => c.InstallmentPlans)
            .HasForeignKey(i => i.ContractId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore calculated properties
        builder.Ignore(i => i.IsOverdue);
    }
}
