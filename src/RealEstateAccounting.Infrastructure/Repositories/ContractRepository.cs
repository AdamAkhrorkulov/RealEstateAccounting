using Microsoft.EntityFrameworkCore;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class ContractRepository : GenericRepository<Contract>, IContractRepository
{
    public ContractRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<IEnumerable<Contract>> GetAllAsync()
    {
        return await _dbSet
            .Include(c => c.Customer)
            .Include(c => c.Apartment)
            .Include(c => c.Agent)
            .Include(c => c.Payments)
            .ToListAsync();
    }

    public async Task<Contract?> GetContractWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Customer)
            .Include(c => c.Apartment)
            .Include(c => c.Agent)
            .Include(c => c.Payments)
            .Include(c => c.InstallmentPlans)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<IEnumerable<Contract>> GetContractsByCustomerAsync(int customerId)
    {
        return await _dbSet
            .Include(c => c.Apartment)
            .Include(c => c.Agent)
            .Include(c => c.Payments)
            .Where(c => c.CustomerId == customerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Contract>> GetContractsByAgentAsync(int agentId)
    {
        return await _dbSet
            .Include(c => c.Customer)
            .Include(c => c.Apartment)
            .Include(c => c.Payments)
            .Where(c => c.AgentId == agentId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Contract>> GetContractsByStatusAsync(ContractStatus status)
    {
        return await _dbSet
            .Include(c => c.Customer)
            .Include(c => c.Apartment)
            .Include(c => c.Payments)
            .Where(c => c.Status == status)
            .ToListAsync();
    }

    public async Task<IEnumerable<Contract>> GetOverdueContractsAsync()
    {
        return await _dbSet
            .Include(c => c.Customer)
            .Include(c => c.Apartment)
            .Include(c => c.Payments)
            .Include(c => c.InstallmentPlans)
            .Where(c => c.Status == ContractStatus.Active &&
                       c.InstallmentPlans.Any(ip => !ip.IsPaid && ip.DueDate < DateTime.UtcNow))
            .ToListAsync();
    }

    public async Task<Contract?> GetByContractNumberAsync(string contractNumber)
    {
        return await _dbSet
            .Include(c => c.Customer)
            .Include(c => c.Apartment)
            .Include(c => c.Agent)
            .Include(c => c.Payments)
            .FirstOrDefaultAsync(c => c.ContractNumber == contractNumber);
    }

    public async Task<string> GetNextContractNumberAsync()
    {
        var currentYear = DateTime.UtcNow.Year;
        var prefix = $"RE-{currentYear}-";

        // Get all contract numbers for the current year
        var lastContract = await _dbSet
            .Where(c => c.ContractNumber.StartsWith(prefix))
            .OrderByDescending(c => c.ContractNumber)
            .Select(c => c.ContractNumber)
            .FirstOrDefaultAsync();

        int nextNumber = 1;

        if (lastContract != null)
        {
            // Extract the numeric part from the last contract number
            var numberPart = lastContract.Replace(prefix, "");
            if (int.TryParse(numberPart, out int lastNumber))
            {
                nextNumber = lastNumber + 1;
            }
        }

        // Format: RE-YYYY-001, RE-YYYY-002, etc.
        return $"{prefix}{nextNumber:D3}";
    }
}
