using Microsoft.EntityFrameworkCore;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class InstallmentPlanRepository : GenericRepository<InstallmentPlan>, IInstallmentPlanRepository
{
    public InstallmentPlanRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<InstallmentPlan>> GetPlansByContractAsync(int contractId)
    {
        return await _dbSet
            .Where(ip => ip.ContractId == contractId)
            .OrderBy(ip => ip.MonthNumber)
            .ToListAsync();
    }

    public async Task<IEnumerable<InstallmentPlan>> GetOverduePlansAsync()
    {
        return await _dbSet
            .Include(ip => ip.Contract)
            .ThenInclude(c => c.Customer)
            .Where(ip => !ip.IsPaid && ip.DueDate < DateTime.UtcNow)
            .OrderBy(ip => ip.DueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<InstallmentPlan>> GetUnpaidPlansAsync(int contractId)
    {
        return await _dbSet
            .Where(ip => ip.ContractId == contractId && !ip.IsPaid)
            .OrderBy(ip => ip.MonthNumber)
            .ToListAsync();
    }

    public async Task MarkAsPaidAsync(int installmentPlanId, int paymentId)
    {
        var plan = await _dbSet.FindAsync(installmentPlanId);
        if (plan != null)
        {
            plan.IsPaid = true;
            plan.PaidDate = DateTime.UtcNow;
        }
    }
}
