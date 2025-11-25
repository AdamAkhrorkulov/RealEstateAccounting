using RealEstateAccounting.Application.DTOs;

namespace RealEstateAccounting.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto dto, string userId);
    Task<PaymentDto> GetPaymentByIdAsync(int id);
    Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync();
    Task<IEnumerable<PaymentDto>> GetPaymentsByContractAsync(int contractId);
    Task<PaymentReportDto> GetPaymentReportAsync(DateTime startDate, DateTime endDate);
    Task<decimal> GetTotalPaymentsAsync(DateTime? startDate = null, DateTime? endDate = null);
    Task<bool> DeletePaymentAsync(int id);
}
