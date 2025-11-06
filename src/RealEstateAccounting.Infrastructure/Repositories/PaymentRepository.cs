using Microsoft.EntityFrameworkCore;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByContractAsync(int contractId)
    {
        return await _dbSet
            .Where(p => p.ContractId == contractId)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Include(p => p.Contract)
            .ThenInclude(c => c.Customer)
            .Where(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate)
            .OrderBy(p => p.PaymentDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByTypeAsync(PaymentType paymentType)
    {
        return await _dbSet
            .Where(p => p.PaymentType == paymentType)
            .OrderByDescending(p => p.PaymentDate)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalPaymentsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _dbSet.AsQueryable();

        if (startDate.HasValue)
            query = query.Where(p => p.PaymentDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.PaymentDate <= endDate.Value);

        return await query.SumAsync(p => p.Amount);
    }

    public async Task<decimal> GetTotalPaymentsByAgentAsync(int agentId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var query = _dbSet
            .Include(p => p.Contract)
            .Where(p => p.Contract.AgentId == agentId);

        if (startDate.HasValue)
            query = query.Where(p => p.PaymentDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.PaymentDate <= endDate.Value);

        return await query.SumAsync(p => p.Amount);
    }
}
