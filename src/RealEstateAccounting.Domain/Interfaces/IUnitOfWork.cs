namespace RealEstateAccounting.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IApartmentRepository Apartments { get; }
    ICustomerRepository Customers { get; }
    IAgentRepository Agents { get; }
    IContractRepository Contracts { get; }
    IPaymentRepository Payments { get; }
    IInstallmentPlanRepository InstallmentPlans { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
