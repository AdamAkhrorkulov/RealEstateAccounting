using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Infrastructure.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("Payments");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Amount)
            .HasPrecision(18, 2);

        builder.Property(p => p.Notes)
            .HasMaxLength(500);

        builder.Property(p => p.ReceiptNumber)
            .HasMaxLength(100);

        builder.Property(p => p.RecordedByUserId)
            .IsRequired()
            .HasMaxLength(450);

        builder.HasIndex(p => p.PaymentDate);
        builder.HasIndex(p => p.ContractId);

        // Relationships
        builder.HasOne(p => p.Contract)
            .WithMany(c => c.Payments)
            .HasForeignKey(p => p.ContractId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.InstallmentPlan)
            .WithOne(i => i.Payment)
            .HasForeignKey<Payment>(p => p.InstallmentPlanId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
