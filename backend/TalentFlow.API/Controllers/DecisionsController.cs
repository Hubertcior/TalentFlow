using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers;

[ApiController]
[Route("api/decisions")]
[Authorize]
public class DecisionsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? forMe)
    {
        var query = db.Decisions
            .Include(d => d.Talent)
            .Include(d => d.Company)
            .AsQueryable();

        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
        var talentId = User.FindFirst("talentId")?.Value;
        var companyId = User.FindFirst("companyId")?.Value;

        if (role == "Talent" && !string.IsNullOrEmpty(talentId))
            query = query.Where(d => d.TalentId == talentId);
        else if (role == "Mentor" && !string.IsNullOrEmpty(companyId))
            query = query.Where(d => d.CompanyId == companyId);

        var decisions = await query.OrderByDescending(d => d.CreatedAt).ToListAsync();
        return Ok(decisions.Select(d => d.ToDto()));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDecisionRequest req)
    {
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return Forbid();

        if (!Enum.TryParse<DecisionOutcome>(req.Outcome, true, out var outcome))
            return BadRequest("Nieprawidłowy wynik decyzji");

        if (outcome == DecisionOutcome.Rejected && string.IsNullOrEmpty(req.Tip))
            return BadRequest("Odrzucenie wymaga podania wskazówki");

        var decision = new Decision
        {
            Id = $"dec-{Guid.NewGuid():N}",
            TalentId = req.TalentId,
            CompanyId = companyId,
            TaskId = req.TaskId,
            Outcome = outcome,
            Tip = req.Tip,
            Note = req.Note,
            CreatedAt = DateTime.UtcNow,
            ResponseTimeHours = 0,
        };

        db.Decisions.Add(decision);
        await db.SaveChangesAsync();
        await db.Entry(decision).Reference(d => d.Talent).LoadAsync();
        await db.Entry(decision).Reference(d => d.Company).LoadAsync();
        return CreatedAtAction(nameof(GetAll), decision.ToDto());
    }

    [HttpPatch("{id}/usefulness")]
    public async Task<IActionResult> RateUsefulness(string id, [FromBody] RateDecisionRequest req)
    {
        var talentId = User.FindFirst("talentId")?.Value;
        if (string.IsNullOrEmpty(talentId)) return Forbid();

        if (req.Usefulness is < 1 or > 5) return BadRequest("Ocena musi być od 1 do 5");

        var decision = await db.Decisions
            .Include(d => d.Talent)
            .Include(d => d.Company)
            .FirstOrDefaultAsync(d => d.Id == id && d.TalentId == talentId);

        if (decision is null) return NotFound();

        decision.Usefulness = req.Usefulness;
        await db.SaveChangesAsync();
        return Ok(decision.ToDto());
    }
}
