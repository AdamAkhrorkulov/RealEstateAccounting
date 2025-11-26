using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;

namespace RealEstateAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IContractService _contractService;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IPaymentService paymentService, IContractService contractService, ILogger<PaymentsController> logger)
    {
        _paymentService = paymentService;
        _contractService = contractService;
        _logger = logger;
    }

    // Helper methods to get current user context
    private string GetCurrentUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    private int? GetCurrentAgentId() => int.TryParse(User.FindFirst("AgentId")?.Value, out var id) ? id : null;
    private int? GetCurrentCustomerId() => int.TryParse(User.FindFirst("CustomerId")?.Value, out var id) ? id : null;
    private bool IsAdmin() => User.IsInRole("Admin");
    private bool IsAccountant() => User.IsInRole("Accountant");
    private bool IsAgent() => User.IsInRole("Agent");
    private bool IsCustomer() => User.IsInRole("Customer");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAll()
    {
        try
        {
            var payments = await _paymentService.GetAllPaymentsAsync();

            // Filter payments based on user role
            if (IsAgent())
            {
                var agentId = GetCurrentAgentId();
                if (!agentId.HasValue)
                    return Forbid();

                // Filter payments to only show those for contracts belonging to this agent
                payments = payments.Where(p =>
                {
                    var contract = _contractService.GetContractByIdAsync(p.ContractId).Result;
                    return contract.AgentId == agentId.Value;
                }).ToList();
            }
            else if (IsCustomer())
            {
                var customerId = GetCurrentCustomerId();
                if (!customerId.HasValue)
                    return Forbid();

                // Filter payments to only show those for contracts belonging to this customer
                payments = payments.Where(p =>
                {
                    var contract = _contractService.GetContractByIdAsync(p.ContractId).Result;
                    return contract.CustomerId == customerId.Value;
                }).ToList();
            }

            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all payments");
            return StatusCode(500, new { message = "An error occurred while retrieving payments" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentDto>> GetById(int id)
    {
        try
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);

            // Verify user has permission to view this payment
            if (!await CanAccessPayment(payment))
                return Forbid();

            return Ok(payment);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payment {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving payment" });
        }
    }

    [HttpGet("contract/{contractId}")]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetByContract(int contractId)
    {
        try
        {
            // Verify user has permission to view this contract's payments
            var contract = await _contractService.GetContractByIdAsync(contractId);
            if (!await CanAccessContract(contract))
                return Forbid();

            var payments = await _paymentService.GetPaymentsByContractAsync(contractId);
            return Ok(payments);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payments for contract {ContractId}", contractId);
            return StatusCode(500, new { message = "An error occurred while retrieving payments" });
        }
    }

    // Helper method to check if current user can access a payment
    private async Task<bool> CanAccessPayment(PaymentDto payment)
    {
        if (IsAdmin() || IsAccountant())
            return true;

        var contract = await _contractService.GetContractByIdAsync(payment.ContractId);
        return await CanAccessContract(contract);
    }

    // Helper method to check if current user can access a contract
    private async Task<bool> CanAccessContract(ContractDto contract)
    {
        if (IsAdmin() || IsAccountant())
            return true;

        if (IsAgent())
        {
            var agentId = GetCurrentAgentId();
            return agentId.HasValue && contract.AgentId == agentId.Value;
        }

        if (IsCustomer())
        {
            var customerId = GetCurrentCustomerId();
            return customerId.HasValue && contract.CustomerId == customerId.Value;
        }

        return false;
    }

    [HttpGet("report")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<PaymentReportDto>> GetReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var report = await _paymentService.GetPaymentReportAsync(startDate, endDate);
            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating payment report");
            return StatusCode(500, new { message = "An error occurred while generating payment report" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<PaymentDto>> Create([FromBody] CreatePaymentDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var payment = await _paymentService.CreatePaymentAsync(dto, userId);
            _logger.LogInformation("Payment {Id} created for contract {ContractId}, Amount: {Amount}",
                payment.Id, payment.ContractId, payment.Amount);
            return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment");
            return StatusCode(500, new { message = "An error occurred while creating payment" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _paymentService.DeletePaymentAsync(id);
            if (!result)
                return NotFound(new { message = "Payment not found" });

            _logger.LogInformation("Payment {Id} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting payment {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting payment" });
        }
    }
}
