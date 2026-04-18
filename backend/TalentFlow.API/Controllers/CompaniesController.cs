using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers;

[ApiController]
[Route("api/companies")]
[Authorize]
public class CompaniesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var companies = await db.Companies.ToListAsync();
        return Ok(companies.Select(c => c.ToDto()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var company = await db.Companies.FindAsync(id);
        if (company is null) return NotFound();
        return Ok(company.ToDto());
    }
}
