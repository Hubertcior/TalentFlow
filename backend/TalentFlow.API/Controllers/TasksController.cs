using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var query = db.Tasks.Include(t => t.Company).AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<Models.TaskStatus>(status, true, out var ts))
            query = query.Where(t => t.Status == ts);

        var tasks = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return Ok(tasks.Select(t => t.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var task = await db.Tasks.Include(t => t.Company).FirstOrDefaultAsync(t => t.Id == id);
        if (task is null) return NotFound();
        return Ok(task.ToDto());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest req)
    {
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return Forbid();

        var task = new BattleTask
        {
            Id = $"task-{Guid.NewGuid():N}",
            CompanyId = companyId,
            Title = req.Title,
            Brief = req.Brief,
            Reward = req.Reward,
            Industry = req.Industry,
            Status = Models.TaskStatus.Open,
            DueAt = req.DueAt,
            CreatedAt = DateTime.UtcNow,
        };

        db.Tasks.Add(task);
        await db.SaveChangesAsync();

        await db.Entry(task).Reference(t => t.Company).LoadAsync();
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task.ToDto());
    }

    [HttpGet("{taskId}/submissions")]
    public async Task<IActionResult> GetSubmissions(string taskId)
    {
        var subs = await db.Submissions
            .Include(s => s.Talent)
            .Where(s => s.TaskId == taskId)
            .ToListAsync();
        return Ok(subs.Select(s => s.ToDto()));
    }

    [HttpPost("{taskId}/submissions")]
    public async Task<IActionResult> Submit(string taskId, [FromBody] CreateSubmissionRequest req)
    {
        var talentId = User.FindFirst("talentId")?.Value;
        if (string.IsNullOrEmpty(talentId)) return Forbid();

        var task = await db.Tasks.FindAsync(taskId);
        if (task is null) return NotFound("Zadanie nie istnieje");
        if (task.Status != Models.TaskStatus.Open) return BadRequest("Zadanie jest zamknięte");

        var existing = await db.Submissions.FirstOrDefaultAsync(s => s.TaskId == taskId && s.TalentId == talentId);
        if (existing is not null)
        {
            existing.Summary = req.Summary;
            existing.Link = req.Link;
            existing.SubmittedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
            await db.Entry(existing).Reference(s => s.Talent).LoadAsync();
            return Ok(existing.ToDto());
        }

        var sub = new Submission
        {
            Id = $"sub-{Guid.NewGuid():N}",
            TaskId = taskId,
            TalentId = talentId,
            Summary = req.Summary,
            Link = req.Link,
            SubmittedAt = DateTime.UtcNow,
        };

        db.Submissions.Add(sub);
        await db.SaveChangesAsync();
        await db.Entry(sub).Reference(s => s.Talent).LoadAsync();
        return CreatedAtAction(nameof(GetSubmissions), new { taskId }, sub.ToDto());
    }

    [HttpPost("{taskId}/top3")]
    public async Task<IActionResult> SelectTop3(string taskId, [FromBody] SelectTop3Request req)
    {
        var companyId = User.FindFirst("companyId")?.Value;
        if (string.IsNullOrEmpty(companyId)) return Forbid();

        var task = await db.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.CompanyId == companyId);
        if (task is null) return NotFound();

        if (req.Rankings.Count is < 1 or > 3) return BadRequest("Podaj 1-3 zgłoszenia");

        var submissionIds = req.Rankings.Select(r => r.Id).ToList();
        var submissions = await db.Submissions
            .Include(s => s.Talent)
            .Where(s => submissionIds.Contains(s.Id) && s.TaskId == taskId)
            .ToListAsync();

        var company = await db.Companies.FindAsync(companyId);
        var total = await db.Submissions.CountAsync(s => s.TaskId == taskId);

        foreach (var ranking in req.Rankings)
        {
            var sub = submissions.FirstOrDefault(s => s.Id == ranking.Id);
            if (sub is null) continue;

            sub.Rank = ranking.Rank;

            var existingBadge = await db.Badges.FirstOrDefaultAsync(b =>
                b.TalentId == sub.TalentId && b.TaskTitle == task.Title);

            if (existingBadge is null)
            {
                db.Badges.Add(new Badge
                {
                    Id = $"badge-{Guid.NewGuid():N}",
                    TalentId = sub.TalentId,
                    Company = company?.Name ?? "",
                    TaskTitle = task.Title,
                    Rank = ranking.Rank,
                    Total = total,
                    AwardedAt = DateTime.UtcNow,
                });
            }
        }

        task.Status = Models.TaskStatus.Closed;
        await db.SaveChangesAsync();
        return Ok();
    }
}
