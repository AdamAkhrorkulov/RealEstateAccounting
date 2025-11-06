using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Domain.Interfaces;

public interface IInstallmentPlanRepository : IGenericRepository<InstallmentPlan>
{
    Task<IEnumerable<InstallmentPlan>> GetPlansByContractAsync(int contractId);
    Task<IEnumerable<InstallmentPlan>> GetOverduePlansAsync();
    Task<IEnumerable<InstallmentPlan>> GetUnpaidPlansAsync(int contractId);
    Task MarkAsPaidAsync(int installmentPlanId, int paymentId);
}
