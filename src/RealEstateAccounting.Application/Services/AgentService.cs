using AutoMapper;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Interfaces;

namespace RealEstateAccounting.Application.Services;

public class AgentService : IAgentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AgentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AgentDto> CreateAgentAsync(CreateAgentDto dto)
    {
        var agent = _mapper.Map<Agent>(dto);
        await _unitOfWork.Agents.AddAsync(agent);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<AgentDto>(agent);
    }

    public async Task<AgentDto> GetAgentByIdAsync(int id)
    {
        var agent = await _unitOfWork.Agents.GetByIdAsync(id);
        if (agent == null)
            throw new ArgumentException("Agent not found");

        return _mapper.Map<AgentDto>(agent);
    }

    public async Task<IEnumerable<AgentDto>> GetAllAgentsAsync()
    {
        var agents = await _unitOfWork.Agents.GetAllAsync();
        return _mapper.Map<IEnumerable<AgentDto>>(agents);
    }

    public async Task<IEnumerable<AgentPerformanceDto>> GetTopPerformingAgentsAsync(int count)
    {
        var agents = await _unitOfWork.Agents.GetTopPerformingAgentsAsync(count);
        var performanceDtos = _mapper.Map<IEnumerable<AgentPerformanceDto>>(agents).ToList();

        // Calculate total revenue for each agent
        foreach (var dto in performanceDtos)
        {
            var totalRevenue = await _unitOfWork.Payments.GetTotalPaymentsByAgentAsync(dto.AgentId);
            dto.TotalRevenue = totalRevenue;
        }

        return performanceDtos;
    }

    public async Task<AgentDto> UpdateAgentAsync(int id, UpdateAgentDto dto)
    {
        var agent = await _unitOfWork.Agents.GetByIdAsync(id);
        if (agent == null)
            throw new ArgumentException("Agent not found");

        _mapper.Map(dto, agent);

        await _unitOfWork.Agents.UpdateAsync(agent);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<AgentDto>(agent);
    }

    public async Task<bool> DeleteAgentAsync(int id)
    {
        var agent = await _unitOfWork.Agents.GetByIdAsync(id);
        if (agent == null)
            return false;

        await _unitOfWork.Agents.DeleteAsync(agent);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
