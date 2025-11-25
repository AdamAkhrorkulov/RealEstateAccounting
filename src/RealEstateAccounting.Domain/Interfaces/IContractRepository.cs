using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Domain.Interfaces;

public interface IContractRepository : IGenericRepository<Contract>
{
    Task<Contract?> GetContractWithDetailsAsync(int id);
    Task<IEnumerable<Contract>> GetContractsByCustomerAsync(int customerId);
    Task<IEnumerable<Contract>> GetContractsByAgentAsync(int agentId);
    Task<IEnumerable<Contract>> GetContractsByStatusAsync(ContractStatus status);
    Task<IEnumerable<Contract>> GetOverdueContractsAsync();
    Task<Contract?> GetByContractNumberAsync(string contractNumber);
    Task<string> GetNextContractNumberAsync();
}
