using Microsoft.EntityFrameworkCore;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class AgentRepository : GenericRepository<Agent>, IAgentRepository
{
    public AgentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Agent?> GetAgentWithContractsAsync(int id)
    {
        return await _dbSet
            .Include(a => a.Contracts)
            .ThenInclude(c => c.Customer)
            .Include(a => a.Contracts)
            .ThenInclude(c => c.Apartment)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Agent>> GetTopPerformingAgentsAsync(int count)
    {
        return await _dbSet
            .OrderByDescending(a => a.TotalSales)
            .ThenByDescending(a => a.TotalCommissionEarned)
            .Take(count)
            .ToListAsync();
    }

    public async Task UpdateAgentStatisticsAsync(int agentId, decimal commission, int salesCount)
    {
        var agent = await _dbSet.FindAsync(agentId);
        if (agent != null)
        {
            agent.TotalCommissionEarned += commission;
            agent.TotalSales += salesCount;
        }
    }
}
