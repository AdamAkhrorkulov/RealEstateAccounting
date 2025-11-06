using AutoMapper;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;
using RealEstateAccounting.Domain.Interfaces;

namespace RealEstateAccounting.Application.Services;

public class ContractService : IContractService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ContractService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ContractDto> CreateContractAsync(CreateContractDto dto, string userId)
    {
        // Validate apartment is available
        var apartment = await _unitOfWork.Apartments.GetByIdAsync(dto.ApartmentId);
        if (apartment == null)
            throw new ArgumentException("Apartment not found");

        if (apartment.Status != ApartmentStatus.Available)
            throw new InvalidOperationException("Apartment is not available");

        // Validate customer and agent exist
        var customer = await _unitOfWork.Customers.GetByIdAsync(dto.CustomerId);
        if (customer == null)
            throw new ArgumentException("Customer not found");

        var agent = await _unitOfWork.Agents.GetByIdAsync(dto.AgentId);
        if (agent == null)
            throw new ArgumentException("Agent not found");

        // Check if contract number is unique
        var existingContract = await _unitOfWork.Contracts.GetByContractNumberAsync(dto.ContractNumber);
        if (existingContract != null)
            throw new InvalidOperationException("Contract number already exists");

        // Create contract
        var contract = _mapper.Map<Contract>(dto);
        contract.TotalAmount = apartment.TotalPrice;

        // Calculate monthly payment
        var remainingAmount = contract.TotalAmount - contract.DownPayment;
        contract.MonthlyPayment = Math.Round(remainingAmount / contract.DurationMonths, 2);

        await _unitOfWork.Contracts.AddAsync(contract);

        // Update apartment status
        apartment.Status = ApartmentStatus.Sold;
        await _unitOfWork.Apartments.UpdateAsync(apartment);

        // Generate installment plan
        await GenerateInstallmentPlanAsync(contract);

        // Update agent statistics
        var commission = apartment.TotalPrice * (agent.CommissionPercentage / 100);
        await _unitOfWork.Agents.UpdateAgentStatisticsAsync(agent.Id, commission, 1);

        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ContractDto>(contract);
    }

    public async Task<ContractDto> GetContractByIdAsync(int id)
    {
        var contract = await _unitOfWork.Contracts.GetContractWithDetailsAsync(id);
        if (contract == null)
            throw new ArgumentException("Contract not found");

        return _mapper.Map<ContractDto>(contract);
    }

    public async Task<ContractDetailsDto> GetContractDetailsAsync(int id)
    {
        var contract = await _unitOfWork.Contracts.GetContractWithDetailsAsync(id);
        if (contract == null)
            throw new ArgumentException("Contract not found");

        return _mapper.Map<ContractDetailsDto>(contract);
    }

    public async Task<IEnumerable<ContractDto>> GetAllContractsAsync()
    {
        var contracts = await _unitOfWork.Contracts.GetAllAsync();
        return _mapper.Map<IEnumerable<ContractDto>>(contracts);
    }

    public async Task<IEnumerable<ContractDto>> GetContractsByCustomerAsync(int customerId)
    {
        var contracts = await _unitOfWork.Contracts.GetContractsByCustomerAsync(customerId);
        return _mapper.Map<IEnumerable<ContractDto>>(contracts);
    }

    public async Task<IEnumerable<ContractDto>> GetContractsByAgentAsync(int agentId)
    {
        var contracts = await _unitOfWork.Contracts.GetContractsByAgentAsync(agentId);
        return _mapper.Map<IEnumerable<ContractDto>>(contracts);
    }

    public async Task<IEnumerable<ContractDto>> GetOverdueContractsAsync()
    {
        var contracts = await _unitOfWork.Contracts.GetOverdueContractsAsync();
        return _mapper.Map<IEnumerable<ContractDto>>(contracts);
    }

    public async Task<ContractDto> UpdateContractAsync(int id, UpdateContractDto dto)
    {
        var contract = await _unitOfWork.Contracts.GetByIdAsync(id);
        if (contract == null)
            throw new ArgumentException("Contract not found");

        _mapper.Map(dto, contract);

        // Recalculate monthly payment if duration or down payment changed
        var remainingAmount = contract.TotalAmount - contract.DownPayment;
        contract.MonthlyPayment = Math.Round(remainingAmount / contract.DurationMonths, 2);

        await _unitOfWork.Contracts.UpdateAsync(contract);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ContractDto>(contract);
    }

    public async Task<bool> DeleteContractAsync(int id)
    {
        var contract = await _unitOfWork.Contracts.GetByIdAsync(id);
        if (contract == null)
            return false;

        // Update apartment status back to available
        var apartment = await _unitOfWork.Apartments.GetByIdAsync(contract.ApartmentId);
        if (apartment != null)
        {
            apartment.Status = ApartmentStatus.Available;
            await _unitOfWork.Apartments.UpdateAsync(apartment);
        }

        await _unitOfWork.Contracts.DeleteAsync(contract);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task UpdateContractStatusAsync(int contractId)
    {
        var contract = await _unitOfWork.Contracts.GetContractWithDetailsAsync(contractId);
        if (contract == null)
            return;

        var unpaidPlans = contract.InstallmentPlans.Where(ip => !ip.IsPaid).ToList();
        var hasOverdue = unpaidPlans.Any(ip => ip.DueDate < DateTime.UtcNow);

        if (!unpaidPlans.Any())
        {
            contract.Status = ContractStatus.Completed;
        }
        else if (hasOverdue)
        {
            contract.Status = ContractStatus.Overdue;
        }
        else
        {
            contract.Status = ContractStatus.Active;
        }

        await _unitOfWork.Contracts.UpdateAsync(contract);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task GenerateInstallmentPlanAsync(Contract contract)
    {
        var currentDate = contract.ContractDate.AddMonths(1);

        for (int month = 1; month <= contract.DurationMonths; month++)
        {
            var installmentPlan = new InstallmentPlan
            {
                ContractId = contract.Id,
                MonthNumber = month,
                DueDate = currentDate,
                ScheduledAmount = contract.MonthlyPayment,
                IsPaid = false
            };

            await _unitOfWork.InstallmentPlans.AddAsync(installmentPlan);
            currentDate = currentDate.AddMonths(1);
        }
    }
}
