using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Application.Interfaces;

namespace RealEstateAccounting.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApartmentsController : ControllerBase
{
    private readonly IApartmentService _apartmentService;
    private readonly ILogger<ApartmentsController> _logger;

    public ApartmentsController(IApartmentService apartmentService, ILogger<ApartmentsController> logger)
    {
        _apartmentService = apartmentService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApartmentDto>>> GetAll()
    {
        try
        {
            var apartments = await _apartmentService.GetAllApartmentsAsync();
            return Ok(apartments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving apartments");
            return StatusCode(500, new { message = "An error occurred while retrieving apartments" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApartmentDto>> GetById(int id)
    {
        try
        {
            var apartment = await _apartmentService.GetApartmentByIdAsync(id);
            return Ok(apartment);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving apartment {Id}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving apartment" });
        }
    }

    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<ApartmentDto>>> GetAvailable()
    {
        try
        {
            var apartments = await _apartmentService.GetAvailableApartmentsAsync();
            return Ok(apartments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving available apartments");
            return StatusCode(500, new { message = "An error occurred while retrieving available apartments" });
        }
    }

    [HttpGet("block/{block}")]
    public async Task<ActionResult<IEnumerable<ApartmentDto>>> GetByBlock(string block)
    {
        try
        {
            var apartments = await _apartmentService.GetApartmentsByBlockAsync(block);
            return Ok(apartments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving apartments for block {Block}", block);
            return StatusCode(500, new { message = "An error occurred while retrieving apartments" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<ApartmentDto>> Create([FromBody] CreateApartmentDto dto)
    {
        try
        {
            var apartment = await _apartmentService.CreateApartmentAsync(dto);
            _logger.LogInformation("Apartment {ApartmentNumber} created", apartment.ApartmentNumber);
            return CreatedAtAction(nameof(GetById), new { id = apartment.Id }, apartment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating apartment");
            return StatusCode(500, new { message = "An error occurred while creating apartment" });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Accountant")]
    public async Task<ActionResult<ApartmentDto>> Update(int id, [FromBody] UpdateApartmentDto dto)
    {
        try
        {
            var apartment = await _apartmentService.UpdateApartmentAsync(id, dto);
            _logger.LogInformation("Apartment {Id} updated", id);
            return Ok(apartment);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating apartment {Id}", id);
            return StatusCode(500, new { message = "An error occurred while updating apartment" });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _apartmentService.DeleteApartmentAsync(id);
            if (!result)
                return NotFound(new { message = "Apartment not found" });

            _logger.LogInformation("Apartment {Id} deleted", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting apartment {Id}", id);
            return StatusCode(500, new { message = "An error occurred while deleting apartment" });
        }
    }
}
