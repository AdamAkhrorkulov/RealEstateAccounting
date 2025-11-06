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
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentDto>> GetById(int id)
    {
        try
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
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
            var payments = await _paymentService.GetPaymentsByContractAsync(contractId);
            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving payments for contract {ContractId}", contractId);
            return StatusCode(500, new { message = "An error occurred while retrieving payments" });
        }
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
