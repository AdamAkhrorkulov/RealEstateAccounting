using AutoMapper;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;
using RealEstateAccounting.Domain.Interfaces;

namespace RealEstateAccounting.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IContractService _contractService;
    private readonly IUserService _userService;

    public PaymentService(IUnitOfWork unitOfWork, IMapper mapper, IContractService contractService, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contractService = contractService;
        _userService = userService;
    }

    public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto dto, string userId)
    {
        // Validate contract exists
        var contract = await _unitOfWork.Contracts.GetByIdAsync(dto.ContractId);
        if (contract == null)
            throw new ArgumentException("Contract not found");

        // Create payment
        var payment = _mapper.Map<Payment>(dto);
        payment.RecordedByUserId = userId;

        await _unitOfWork.Payments.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync(); // Save to get the payment ID

        // If no installment plan specified, automatically link to next unpaid plan
        if (!dto.InstallmentPlanId.HasValue)
        {
            var unpaidPlans = await _unitOfWork.InstallmentPlans.GetUnpaidPlansAsync(dto.ContractId);
            var nextUnpaidPlan = unpaidPlans.OrderBy(p => p.MonthNumber).FirstOrDefault();

            if (nextUnpaidPlan != null)
            {
                payment.InstallmentPlanId = nextUnpaidPlan.Id;
                await _unitOfWork.InstallmentPlans.MarkAsPaidAsync(nextUnpaidPlan.Id, payment.Id);
            }
        }
        else
        {
            // If linked to specific installment plan, mark it as paid
            await _unitOfWork.InstallmentPlans.MarkAsPaidAsync(dto.InstallmentPlanId.Value, payment.Id);
        }

        await _unitOfWork.SaveChangesAsync();

        // Update contract status
        await _contractService.UpdateContractStatusAsync(dto.ContractId);

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<PaymentDto> GetPaymentByIdAsync(int id)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (payment == null)
            throw new ArgumentException("Payment not found");

        return _mapper.Map<PaymentDto>(payment);
    }

    public async Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync()
    {
        var payments = await _unitOfWork.Payments.GetAllAsync();
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByContractAsync(int contractId)
    {
        var payments = await _unitOfWork.Payments.GetPaymentsByContractAsync(contractId);
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<PaymentReportDto> GetPaymentReportAsync(DateTime startDate, DateTime endDate)
    {
        var payments = await _unitOfWork.Payments.GetPaymentsByDateRangeAsync(startDate, endDate);
        var paymentsList = payments.ToList();

        var totalCash = paymentsList
            .Where(p => p.PaymentType == PaymentType.Cash)
            .Sum(p => p.Amount);

        var totalNonCash = paymentsList
            .Where(p => p.PaymentType == PaymentType.NonCash)
            .Sum(p => p.Amount);

        var paymentDtos = _mapper.Map<List<PaymentDto>>(paymentsList);

        return new PaymentReportDto
        {
            StartDate = startDate,
            EndDate = endDate,
            TotalCash = totalCash,
            TotalNonCash = totalNonCash,
            GrandTotal = totalCash + totalNonCash,
            Payments = paymentDtos
        };
    }

    public async Task<decimal> GetTotalPaymentsAsync(DateTime? startDate = null, DateTime? endDate = null)
    {
        return await _unitOfWork.Payments.GetTotalPaymentsAsync(startDate, endDate);
    }

    public async Task<bool> DeletePaymentAsync(int id)
    {
        var payment = await _unitOfWork.Payments.GetByIdAsync(id);
        if (payment == null)
            return false;

        // If linked to installment plan, mark it as unpaid
        if (payment.InstallmentPlanId.HasValue)
        {
            var plan = await _unitOfWork.InstallmentPlans.GetByIdAsync(payment.InstallmentPlanId.Value);
            if (plan != null)
            {
                plan.IsPaid = false;
                plan.PaidDate = null;
                await _unitOfWork.InstallmentPlans.UpdateAsync(plan);
            }
        }

        await _unitOfWork.Payments.DeleteAsync(payment);
        await _unitOfWork.SaveChangesAsync();

        // Update contract status
        await _contractService.UpdateContractStatusAsync(payment.ContractId);

        return true;
    }
}
