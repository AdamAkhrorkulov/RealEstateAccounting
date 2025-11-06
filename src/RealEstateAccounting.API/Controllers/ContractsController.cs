using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;

namespace RealEstateAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContractsController : ControllerBase
{
    private readonly IContractService _contractService;
    private readonly ILogger<ContractsController> _logger;

    public ContractsController(IContractService contractService, ILogger<ContractsController> logger)
    {
        _contractService = contractService;
        _logger = logger;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetAll()
    {
        try
        {
            var contracts = await _contractService.GetAllContractsAsync();
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contracts");
            return StatusCode(500, new { message = "An error occurred while retrieving contracts" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractDto>> GetById(int id)
    {
        try
        {
            var contract = await _contractService.GetContractByIdAsync(id);
            return Ok(contract);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contract {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving contract" });
        }
    }

    [HttpGet("{id}/details")]
    public async Task<ActionResult<ContractDetailsDto>> GetDetails(int id)
    {
        try
        {
            var contract = await _contractService.GetContractDetailsAsync(id);
            return Ok(contract);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contract details {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving contract details" });
        }
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetByCustomer(int customerId)
    {
        try
        {
            var contracts = await _contractService.GetContractsByCustomerAsync(customerId);
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contracts for customer {CustomerId}", customerId);
            return StatusCode(500, new { message = "An error occurred while retrieving contracts" });
        }
    }

    [HttpGet("agent/{agentId}")]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetByAgent(int agentId)
    {
        try
        {
            var contracts = await _contractService.GetContractsByAgentAsync(agentId);
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contracts for agent {AgentId}", agentId);
            return StatusCode(500, new { message = "An error occurred while retrieving contracts" });
        }
    }

    [HttpGet("overdue")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetOverdue()
    {
        try
        {
            var contracts = await _contractService.GetOverdueContractsAsync();
            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving overdue contracts");
            return StatusCode(500, new { message = "An error occurred while retrieving overdue contracts" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<ContractDto>> Create([FromBody] CreateContractDto dto)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var contract = await _contractService.CreateContractAsync(dto, userId);
            _logger.LogInformation("Contract {ContractNumber} created", contract.ContractNumber);
            return CreatedAtAction(nameof(GetById), new { id = contract.Id }, contract);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating contract");
            return StatusCode(500, new { message = "An error occurred while creating contract" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<ContractDto>> Update(int id, [FromBody] UpdateContractDto dto)
    {
        try
        {
            var contract = await _contractService.UpdateContractAsync(id, dto);
            _logger.LogInformation("Contract {Id} updated", id);
            return Ok(contract);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating contract {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating contract" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _contractService.DeleteContractAsync(id);
            if (!result)
                return NotFound(new { message = "Contract not found" });

            _logger.LogInformation("Contract {Id} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting contract {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting contract" });
        }
    }
}
