using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers;

[ApiController]
[Route("api/talents")]
[Authorize]
public class TalentsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? availability,
        [FromQuery] bool? verified,
        [FromQuery] string? interest,
        [FromQuery] string? industry,
        [FromQuery] string? q)
    {
        var query = db.Talents.Include(t => t.Badges).AsQueryable();

        if (!string.IsNullOrEmpty(availability) && Enum.TryParse<Availability>(availability, true, out var av))
            query = query.Where(t => t.Availability == av);

        if (verified == true)
            query = query.Where(t => t.Badges.Any());

        if (!string.IsNullOrEmpty(industry))
            query = query.Where(t => t.Industry == industry);

        var talents = await query.ToListAsync();

        if (!string.IsNullOrEmpty(interest))
            talents = talents.Where(t =>
            {
                var list = JsonSerializer.Deserialize<List<string>>(t.Interests) ?? [];
                return list.Any(i => i.Contains(interest, StringComparison.OrdinalIgnoreCase));
            }).ToList();

        if (!string.IsNullOrEmpty(q))
            talents = talents.Where(t =>
                t.Name.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                t.RoleTitle.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                t.City.Contains(q, StringComparison.OrdinalIgnoreCase)
            ).ToList();

        return Ok(talents.Select(t => t.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var talent = await db.Talents.Include(t => t.Badges).FirstOrDefaultAsync(t => t.Id == id);
        if (talent is null) return NotFound();
        return Ok(talent.ToDto());
    }

    [HttpPatch("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateTalentRequest req)
    {
        var talentId = User.FindFirst("talentId")?.Value;
        if (string.IsNullOrEmpty(talentId)) return Forbid();

        var talent = await db.Talents.Include(t => t.Badges).FirstOrDefaultAsync(t => t.Id == talentId);
        if (talent is null) return NotFound();

        if (req.Name is not null) talent.Name = req.Name;
        if (req.RoleTitle is not null) talent.RoleTitle = req.RoleTitle;
        if (req.Bio is not null) talent.Bio = req.Bio;
        if (req.City is not null) talent.City = req.City;
        if (req.PortfolioUrl is not null) talent.PortfolioUrl = req.PortfolioUrl;
        if (req.Interests is not null) talent.Interests = JsonSerializer.Serialize(req.Interests);
        if (req.Industry is not null) talent.Industry = req.Industry;
        if (req.Availability is not null && Enum.TryParse<Availability>(req.Availability, true, out var av))
            talent.Availability = av;

        await db.SaveChangesAsync();
        return Ok(talent.ToDto());
    }
}
