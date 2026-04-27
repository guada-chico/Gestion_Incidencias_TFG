using Microsoft.EntityFrameworkCore;
using Fixora.Microservice.Models.Models.Entities;

namespace Fixora.Microservice.DbContext.BoundedContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(Microsoft.EntityFrameworkCore.DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Incidencia> Incidencias { get; set; }
        public DbSet<Usuario> Usuarios { get; set; } 
    }
}
