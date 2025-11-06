using RealEstateAccounting.Domain.Entities;

namespace RealEstateAccounting.Domain.Interfaces;

public interface IAgentRepository : IGenericRepository<Agent>
{
    Task<Agent?> GetAgentWithContractsAsync(int id);
    Task<IEnumerable<Agent>> GetTopPerformingAgentsAsync(int count);
    Task UpdateAgentStatisticsAsync(int agentId, decimal commission, int salesCount);
}
