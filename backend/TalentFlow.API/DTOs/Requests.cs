namespace TalentFlow.API.DTOs;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string Email,
    string Password,
    string DisplayName,
    string Role,         // "talent" | "mentor"
    // Talent fields
    string? RoleTitle,
    string? City,
    int? Age,
    string? TalentIndustry,
    // Mentor fields
    string? CompanyName,
    string? CompanyIndustry
);

public record UpdateTalentRequest(
    string? Name,
    string? RoleTitle,
    string? Bio,
    string? City,
    string? Availability,
    string? PortfolioUrl,
    List<string>? Interests,
    string? Industry
);

public record CreateTaskRequest(
    string Title,
    string Brief,
    string Reward,
    string Industry,
    DateTime DueAt
);

public record CreateSubmissionRequest(string Summary, string? Link);


public record CreateDecisionRequest(
    string TalentId,
    string CompanyId,
    string? TaskId,
    string Outcome,
    string? Tip,
    string? Note
);

public record RateDecisionRequest(int Usefulness);
