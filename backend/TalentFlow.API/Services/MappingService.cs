using System.Text.Json;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;

namespace TalentFlow.API.Services;

public static class MappingService
{
    public static AccountDto ToDto(this Account a) => new(
        a.Id, a.DisplayName, a.Subtitle, a.Initials,
        a.Role.ToString().ToLower(), a.TalentId, a.CompanyId, a.Bio, a.Color
    );

    public static TalentDto ToDto(this Talent t) => new(
        t.Id, t.Name, t.Initials, t.RoleTitle, t.Bio, t.Age, t.City,
        t.Availability.ToString().ToLower(),
        t.PortfolioUrl,
        JsonSerializer.Deserialize<List<string>>(t.Interests) ?? [],
        t.Badges.Select(b => b.ToDto()).ToList()
    );

    public static BadgeDto ToDto(this Badge b) => new(
        b.Id, b.Company, b.TaskTitle, b.Rank, b.Total, b.AwardedAt
    );

    public static CompanyDto ToDto(this Company c) => new(c.Id, c.Name, c.MentorName, c.Industry);

    public static TaskDto ToDto(this BattleTask t) => new(
        t.Id, t.CompanyId, t.Company?.Name ?? "",
        t.Title, t.Brief, t.Reward,
        t.Status.ToString().ToLower(),
        t.Industry, t.DueAt, t.CreatedAt
    );

    public static SubmissionDto ToDto(this Submission s) => new(
        s.Id, s.TaskId, s.TalentId, s.Talent?.Name ?? "",
        s.Summary, s.Link, s.SubmittedAt, s.Rank
    );

    public static DecisionDto ToDto(this Decision d) => new(
        d.Id, d.TalentId, d.Talent?.Name ?? "",
        d.CompanyId, d.Company?.Name ?? "",
        d.TaskId, d.Outcome.ToString().ToLower(),
        d.Tip, d.Note, d.CreatedAt, d.Usefulness, d.ResponseTimeHours
    );
}
