using RealEstateAccounting.Application.DTOs;

namespace RealEstateAccounting.Application.Interfaces;

public interface IContractService
{
    Task<ContractDto> CreateContractAsync(CreateContractDto dto, string userId);
    Task<ContractDto> GetContractByIdAsync(int id);
    Task<ContractDetailsDto> GetContractDetailsAsync(int id);
    Task<IEnumerable<ContractDto>> GetAllContractsAsync();
    Task<IEnumerable<ContractDto>> GetContractsByCustomerAsync(int customerId);
    Task<IEnumerable<ContractDto>> GetContractsByAgentAsync(int agentId);
    Task<IEnumerable<ContractDto>> GetOverdueContractsAsync();
    Task<ContractDto> UpdateContractAsync(int id, UpdateContractDto dto);
    Task<bool> DeleteContractAsync(int id);
    Task UpdateContractStatusAsync(int contractId);
}
