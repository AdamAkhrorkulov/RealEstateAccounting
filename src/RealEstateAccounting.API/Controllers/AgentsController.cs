using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;

namespace RealEstateAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AgentsController : ControllerBase
{
    private readonly IAgentService _agentService;
    private readonly ILogger<AgentsController> _logger;

    public AgentsController(IAgentService agentService, ILogger<AgentsController> logger)
    {
        _agentService = agentService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgentDto>>> GetAll()
    {
        try
        {
            var agents = await _agentService.GetAllAgentsAsync();
            return Ok(agents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving agents");
            return StatusCode(500, new { message = "An error occurred while retrieving agents" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AgentDto>> GetById(int id)
    {
        try
        {
            var agent = await _agentService.GetAgentByIdAsync(id);
            return Ok(agent);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving agent {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving agent" });
        }
    }

    [HttpGet("top-performers")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<IEnumerable<AgentPerformanceDto>>> GetTopPerformers([FromQuery] int count = 10)
    {
        try
        {
            var agents = await _agentService.GetTopPerformingAgentsAsync(count);
            return Ok(agents);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving top performing agents");
            return StatusCode(500, new { message = "An error occurred while retrieving top performing agents" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AgentDto>> Create([FromBody] CreateAgentDto dto)
    {
        try
        {
            var agent = await _agentService.CreateAgentAsync(dto);
            _logger.LogInformation("Agent {FullName} created", agent.FullName);
            return CreatedAtAction(nameof(GetById), new { id = agent.Id }, agent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating agent");
            return StatusCode(500, new { message = "An error occurred while creating agent" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AgentDto>> Update(int id, [FromBody] UpdateAgentDto dto)
    {
        try
        {
            var agent = await _agentService.UpdateAgentAsync(id, dto);
            _logger.LogInformation("Agent {Id} updated", id);
            return Ok(agent);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating agent {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating agent" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _agentService.DeleteAgentAsync(id);
            if (!result)
                return NotFound(new { message = "Agent not found" });

            _logger.LogInformation("Agent {Id} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting agent {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting agent" });
        }
    }
}
