using Gestion_Incidencias_v3.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestion_Incidencias_v3.BoundedContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // The controller and migrations reference the table/property name `Incidencias3`.
        // Keep the same name to avoid breaking existing code/migrations.
        public DbSet<IncidenciasModels> Incidencias3 { get; set; }
    }
}
