namespace TalentFlow.API.DTOs;

public record LoginResponse(string Token, AccountDto Account);

public record AccountDto(
    string Id,
    string DisplayName,
    string Subtitle,
    string Initials,
    string Role,
    string? TalentId,
    string? CompanyId,
    string Bio,
    string Color
);

public record TalentDto(
    string Id,
    string Name,
    string Initials,
    string Role,
    string Bio,
    int Age,
    string City,
    string Availability,
    string? PortfolioUrl,
    List<string> Interests,
    List<BadgeDto> Badges,
    string Industry
);

public record BadgeDto(
    string Id,
    string Company,
    string TaskTitle,
    int Rank,
    int Total,
    DateTime AwardedAt
);

public record CompanyDto(string Id, string Name, string MentorName, string Industry);

public record TaskDto(
    string Id,
    string CompanyId,
    string CompanyName,
    string Title,
    string Brief,
    string Reward,
    string Status,
    string Industry,
    DateTime DueAt,
    DateTime CreatedAt
);

public record SubmissionDto(
    string Id,
    string TaskId,
    string TalentId,
    string TalentName,
    string Summary,
    string? Link,
    DateTime SubmittedAt,
    int? Rank
);

public record DecisionDto(
    string Id,
    string TalentId,
    string TalentName,
    string CompanyId,
    string CompanyName,
    string? TaskId,
    string Outcome,
    string? Tip,
    string? Note,
    DateTime CreatedAt,
    int? Usefulness,
    double ResponseTimeHours
);

public record CompanyScoreDto(
    string CompanyId,
    string CompanyName,
    string MentorName,
    int TotalDecisions,
    double FeedbackRate,
    double AvgResponseHours,
    double AvgUsefulness,
    double Score,
    bool IsTopEmployer
);
