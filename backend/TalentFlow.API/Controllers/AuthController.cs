using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    private static readonly string[] TalentColors =
        ["from-primary to-violet", "from-cyan-500 to-blue-600", "from-rose-400 to-pink-500",
         "from-emerald-400 to-teal-500", "from-amber-400 to-yellow-500"];

    private static readonly string[] MentorColors =
        ["from-violet to-purple-700", "from-indigo-500 to-blue-700", "from-fuchsia-500 to-purple-600"];

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var account = await db.Accounts.FirstOrDefaultAsync(a => a.Email == req.Email);
        if (account is null || !PasswordHelper.Verify(req.Password, account.PasswordHash))
            return Unauthorized("Nieprawidłowy email lub hasło");

        var token = tokenService.GenerateToken(account);
        return Ok(new LoginResponse(token, account.ToDto()));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest("Email i hasło są wymagane");

        if (req.Password.Length < 6)
            return BadRequest("Hasło musi mieć co najmniej 6 znaków");

        if (await db.Accounts.AnyAsync(a => a.Email == req.Email.ToLower()))
            return Conflict("Konto z tym adresem email już istnieje");

        if (!Enum.TryParse<Role>(req.DisplayName.Length > 0 ? req.Role : "", true, out var role))
            return BadRequest("Nieprawidłowa rola — wybierz 'talent' lub 'mentor'");

        var initials = BuildInitials(req.DisplayName);
        var accountId = $"acc-{Guid.NewGuid():N}";
        string? talentId = null;
        string? companyId = null;
        string subtitle;
        string color;

        if (role == Role.Talent)
        {
            talentId = $"t-{Guid.NewGuid():N}";
            var city = req.City?.Trim() ?? "";
            var roleTitle = req.RoleTitle?.Trim() ?? "Talent";
            subtitle = city.Length > 0 ? $"{roleTitle} · {city}" : roleTitle;
            color = TalentColors[accountId.GetHashCode() % TalentColors.Length];
            color = color.StartsWith('-') ? TalentColors[0] : color;

            db.Talents.Add(new Talent
            {
                Id = talentId,
                Name = req.DisplayName.Trim(),
                Initials = initials,
                RoleTitle = roleTitle,
                Bio = "",
                Age = req.Age ?? 20,
                City = city,
                Availability = Availability.Now,
                Interests = "[]",
            });
        }
        else
        {
            companyId = $"c-{Guid.NewGuid():N}";
            var companyName = req.CompanyName?.Trim() ?? req.DisplayName.Trim();
            subtitle = $"Mentor · {companyName}";
            color = MentorColors[Math.Abs(accountId.GetHashCode()) % MentorColors.Length];

            db.Companies.Add(new Company
            {
                Id = companyId,
                Name = companyName,
                MentorName = req.DisplayName.Trim(),
                Industry = req.CompanyIndustry?.Trim() ?? "IT & Technologie",
            });
        }

        var account = new Account
        {
            Id = accountId,
            Email = req.Email.ToLower().Trim(),
            PasswordHash = PasswordHelper.Hash(req.Password),
            DisplayName = req.DisplayName.Trim(),
            Subtitle = subtitle,
            Initials = initials,
            Role = role,
            TalentId = talentId,
            CompanyId = companyId,
            Bio = "",
            Color = color,
        };

        db.Accounts.Add(account);
        await db.SaveChangesAsync();

        var token = tokenService.GenerateToken(account);
        return CreatedAtAction(nameof(Me), new LoginResponse(token, account.ToDto()));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var account = await db.Accounts.FindAsync(id);
        if (account is null) return NotFound();
        return Ok(account.ToDto());
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout() => Ok();

    private static string BuildInitials(string name)
    {
        var parts = name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return parts.Length >= 2
            ? $"{char.ToUpper(parts[0][0])}{char.ToUpper(parts[^1][0])}"
            : name.Length >= 2 ? name[..2].ToUpper() : name.ToUpper();
    }
}
