using Microsoft.EntityFrameworkCore;
using timely.Models;
namespace timely.Data;

public class TimelyDb: DbContext {
    public TimelyDb(DbContextOptions<TimelyDb> options): base(options) {

    }
    public DbSet<Project> Project => Set<Project>();
}