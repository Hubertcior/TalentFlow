using System.ComponentModel.DataAnnotations;

namespace TalentFlow.API.Models;

public enum Availability { Now, Soon, Busy }
public enum TaskStatus { Open, Judging, Closed }
public enum DecisionOutcome { Accepted, Rejected }
public enum Role { Talent, Mentor }

public class Account
{
    [Key] public string Id { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string DisplayName { get; set; } = null!;
    public string Subtitle { get; set; } = null!;
    public string Initials { get; set; } = null!;
    public Role Role { get; set; }
    public string? TalentId { get; set; }
    public string? CompanyId { get; set; }
    public string Bio { get; set; } = null!;
    public string Color { get; set; } = null!;
}

public class Talent
{
    [Key] public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Initials { get; set; } = null!;
    public string RoleTitle { get; set; } = null!;
    public string Bio { get; set; } = null!;
    public int Age { get; set; }
    public string City { get; set; } = null!;
    public Availability Availability { get; set; }
    public string? PortfolioUrl { get; set; }
    public string Interests { get; set; } = "[]";
    public ICollection<Badge> Badges { get; set; } = new List<Badge>();
}

public class Badge
{
    [Key] public string Id { get; set; } = null!;
    public string TalentId { get; set; } = null!;
    public Talent Talent { get; set; } = null!;
    public string Company { get; set; } = null!;
    public string TaskTitle { get; set; } = null!;
    public int Rank { get; set; }
    public int Total { get; set; }
    public DateTime AwardedAt { get; set; }
}

public class Company
{
    [Key] public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string MentorName { get; set; } = null!;
    public string Industry { get; set; } = null!;
}

public class BattleTask
{
    [Key] public string Id { get; set; } = null!;
    public string CompanyId { get; set; } = null!;
    public Company Company { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Brief { get; set; } = null!;
    public string Reward { get; set; } = null!;
    public TaskStatus Status { get; set; }
    public string Industry { get; set; } = null!;
    public DateTime DueAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}

public class Submission
{
    [Key] public string Id { get; set; } = null!;
    public string TaskId { get; set; } = null!;
    public BattleTask Task { get; set; } = null!;
    public string TalentId { get; set; } = null!;
    public Talent Talent { get; set; } = null!;
    public string Summary { get; set; } = null!;
    public string? Link { get; set; }
    public DateTime SubmittedAt { get; set; }
    public int? Rank { get; set; }
}

public class Decision
{
    [Key] public string Id { get; set; } = null!;
    public string TalentId { get; set; } = null!;
    public Talent Talent { get; set; } = null!;
    public string CompanyId { get; set; } = null!;
    public Company Company { get; set; } = null!;
    public string? TaskId { get; set; }
    public DecisionOutcome Outcome { get; set; }
    public string? Tip { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? Usefulness { get; set; }
    public double ResponseTimeHours { get; set; }
}
