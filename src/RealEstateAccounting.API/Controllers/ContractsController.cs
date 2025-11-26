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

    // Helper methods to get current user context
    private string GetCurrentUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
    private int GetCurrentCompanyId() => int.TryParse(User.FindFirst("CompanyId")?.Value, out var id) ? id : 0;  // Multi-tenancy

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetAll()
    {
        try
        {
            var userCompanyId = GetCurrentCompanyId();
            var contracts = await _contractService.GetAllContractsAsync();

            // Multi-tenancy: Filter by company - all admins can see all contracts within their company
            contracts = contracts.Where(c => c.CompanyId == userCompanyId).ToList();

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

            // Verify user has permission to view this contract
            if (!await CanAccessContract(contract))
                return Forbid();

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

            // Verify user has permission to view this contract
            if (!await CanAccessContractDetails(contract))
                return Forbid();

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

    // Helper method to check if current user can access a contract
    private async Task<bool> CanAccessContract(ContractDto contract)
    {
        var userCompanyId = GetCurrentCompanyId();

        // Multi-tenancy: Check company isolation - users can NEVER access data from other companies
        return contract.CompanyId == userCompanyId;
    }

    // Helper method to check if current user can access contract details
    private async Task<bool> CanAccessContractDetails(ContractDetailsDto contract)
    {
        var userCompanyId = GetCurrentCompanyId();

        // Multi-tenancy: Check company isolation - users can NEVER access data from other companies
        return contract.CompanyId == userCompanyId;
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<ContractDto>>> GetByCustomer(int customerId)
    {
        try
        {
            var userCompanyId = GetCurrentCompanyId();
            var contracts = await _contractService.GetContractsByCustomerAsync(customerId);

            // Multi-tenancy: Filter by company
            contracts = contracts.Where(c => c.CompanyId == userCompanyId).ToList();

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
            var userCompanyId = GetCurrentCompanyId();
            var contracts = await _contractService.GetContractsByAgentAsync(agentId);

            // Multi-tenancy: Filter by company
            contracts = contracts.Where(c => c.CompanyId == userCompanyId).ToList();

            return Ok(contracts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contracts for agent {AgentId}", agentId);
            return StatusCode(500, new { message = "An error occurred while retrieving contracts" });
        }
    }

    [HttpGet("overdue")]
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
