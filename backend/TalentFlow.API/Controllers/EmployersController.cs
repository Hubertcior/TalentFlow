using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;

namespace TalentFlow.API.Controllers;

[ApiController]
[Route("api/employers")]
[Authorize]
public class EmployersController(AppDbContext db) : ControllerBase
{
    [HttpGet("scores")]
    public async Task<IActionResult> GetScores()
    {
        var companies = await db.Companies.ToListAsync();
        var decisions = await db.Decisions.ToListAsync();

        var scores = companies.Select(c =>
        {
            var compDecisions = decisions.Where(d => d.CompanyId == c.Id).ToList();
            var total = compDecisions.Count;

            if (total == 0)
                return new CompanyScoreDto(c.Id, c.Name, c.MentorName, 0, 0, 0, 0, 0, false);

            var rejections = compDecisions.Where(d => d.Outcome == Models.DecisionOutcome.Rejected).ToList();
            var rejectionsWithTip = rejections.Count(d => !string.IsNullOrEmpty(d.Tip));
            var feedbackRate = rejections.Count > 0 ? (double)rejectionsWithTip / rejections.Count : 1.0;

            var avgResponseHours = compDecisions.Average(d => d.ResponseTimeHours);
            var speedScore = Math.Max(0, 100 - avgResponseHours);

            var usefulnessRatings = compDecisions.Where(d => d.Usefulness.HasValue).Select(d => d.Usefulness!.Value).ToList();
            var avgUsefulness = usefulnessRatings.Count > 0 ? usefulnessRatings.Average() : 0;

            var score = feedbackRate * 70 + speedScore / 100.0 * 30;
            return new CompanyScoreDto(c.Id, c.Name, c.MentorName, total, feedbackRate, avgResponseHours, avgUsefulness, Math.Round(score, 1), score >= 70);
        })
        .OrderByDescending(s => s.Score)
        .ToList();

        return Ok(scores);
    }
}
