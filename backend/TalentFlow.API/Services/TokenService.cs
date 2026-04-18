using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TalentFlow.API.Models;

namespace TalentFlow.API.Services;

public class TokenService(IConfiguration config)
{
    public string GenerateToken(Account account)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, account.Id),
            new Claim(ClaimTypes.Role, account.Role.ToString()),
            new Claim("talentId", account.TalentId ?? ""),
            new Claim("companyId", account.CompanyId ?? ""),
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
