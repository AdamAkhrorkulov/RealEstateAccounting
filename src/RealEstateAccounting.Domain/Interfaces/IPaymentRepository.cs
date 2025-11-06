using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Domain.Interfaces;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<IEnumerable<Payment>> GetPaymentsByContractAsync(int contractId);
    Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<IEnumerable<Payment>> GetPaymentsByTypeAsync(PaymentType paymentType);
    Task<decimal> GetTotalPaymentsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<decimal> GetTotalPaymentsByAgentAsync(int agentId, DateTime? startDate = null, DateTime? endDate = null);
}
