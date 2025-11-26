using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;

namespace RealEstateAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    private readonly IContractService _contractService;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ICustomerService customerService, IContractService contractService, ILogger<CustomersController> logger)
    {
        _customerService = customerService;
        _contractService = contractService;
        _logger = logger;
    }

    // Helper methods to get current user context
    private int? GetCurrentAgentId() => int.TryParse(User.FindFirst("AgentId")?.Value, out var id) ? id : null;
    private bool IsAdmin() => User.IsInRole("Admin");
    private bool IsAccountant() => User.IsInRole("Accountant");
    private bool IsAgent() => User.IsInRole("Agent");

    [HttpGet]
    [Authorize(Roles = "Admin,Accountant,Agent")]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll()
    {
        try
        {
            var customers = await _customerService.GetAllCustomersAsync();

            // Agents can only see customers from their own contracts
            if (IsAgent())
            {
                var agentId = GetCurrentAgentId();
                if (!agentId.HasValue)
                    return Forbid();

                // Get all contracts for this agent
                var agentContracts = await _contractService.GetContractsByAgentAsync(agentId.Value);
                var agentCustomerIds = agentContracts.Select(c => c.CustomerId).Distinct().ToList();

                // Filter customers to only those in agent's contracts
                customers = customers.Where(c => agentCustomerIds.Contains(c.Id)).ToList();
            }

            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customers");
            return StatusCode(500, new { message = "An error occurred while retrieving customers" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetById(int id)
    {
        try
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            return Ok(customer);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving customer" });
        }
    }

    [HttpGet("search")]
    [Authorize(Roles = "Admin,Accountant,Agent")]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> Search([FromQuery] string searchTerm)
    {
        try
        {
            var customers = await _customerService.SearchCustomersAsync(searchTerm);
            return Ok(customers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching customers");
            return StatusCode(500, new { message = "An error occurred while searching customers" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Accountant,Agent")]
    public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto dto)
    {
        try
        {
            var customer = await _customerService.CreateCustomerAsync(dto);
            _logger.LogInformation("Customer {FullName} created", customer.FullName);
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer");
            return StatusCode(500, new { message = "An error occurred while creating customer" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<CustomerDto>> Update(int id, [FromBody] UpdateCustomerDto dto)
    {
        try
        {
            var customer = await _customerService.UpdateCustomerAsync(id, dto);
            _logger.LogInformation("Customer {Id} updated", id);
            return Ok(customer);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating customer" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _customerService.DeleteCustomerAsync(id);
            if (!result)
                return NotFound(new { message = "Customer not found" });

            _logger.LogInformation("Customer {Id} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting customer" });
        }
    }
}
