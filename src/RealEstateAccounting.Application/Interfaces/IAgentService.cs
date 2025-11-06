using RealEstateAccounting.Application.DTOs;

namespace RealEstateAccounting.Application.Interfaces;

public interface IAgentService
{
    Task<AgentDto> CreateAgentAsync(CreateAgentDto dto);
    Task<AgentDto> GetAgentByIdAsync(int id);
    Task<IEnumerable<AgentDto>> GetAllAgentsAsync();
    Task<IEnumerable<AgentPerformanceDto>> GetTopPerformingAgentsAsync(int count);
    Task<AgentDto> UpdateAgentAsync(int id, UpdateAgentDto dto);
    Task<bool> DeleteAgentAsync(int id);
}
