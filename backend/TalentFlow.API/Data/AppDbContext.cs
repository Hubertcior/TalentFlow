using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Models;

namespace TalentFlow.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Talent> Talents => Set<Talent>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<BattleTask> Tasks => Set<BattleTask>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<Decision> Decisions => Set<Decision>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Talent>().Property(t => t.Availability).HasConversion<string>();
        mb.Entity<BattleTask>().Property(t => t.Status).HasConversion<string>();
        mb.Entity<Decision>().Property(d => d.Outcome).HasConversion<string>();
        mb.Entity<Account>().Property(a => a.Role).HasConversion<string>();
    }
}
