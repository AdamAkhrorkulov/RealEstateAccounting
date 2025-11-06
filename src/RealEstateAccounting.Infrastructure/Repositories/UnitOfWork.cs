using Microsoft.EntityFrameworkCore.Storage;
using RealEstateAccounting.Domain.Interfaces;
using RealEstateAccounting.Infrastructure.Data;

namespace RealEstateAccounting.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    public IApartmentRepository Apartments { get; }
    public ICustomerRepository Customers { get; }
    public IAgentRepository Agents { get; }
    public IContractRepository Contracts { get; }
    public IPaymentRepository Payments { get; }
    public IInstallmentPlanRepository InstallmentPlans { get; }

    public UnitOfWork(
        ApplicationDbContext context,
        IApartmentRepository apartments,
        ICustomerRepository customers,
        IAgentRepository agents,
        IContractRepository contracts,
        IPaymentRepository payments,
        IInstallmentPlanRepository installmentPlans)
    {
        _context = context;
        Apartments = apartments;
        Customers = customers;
        Agents = agents;
        Contracts = contracts;
        Payments = payments;
        InstallmentPlans = installmentPlans;
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await SaveChangesAsync();
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
            }
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
        finally
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}
