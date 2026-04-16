using Microsoft.EntityFrameworkCore;
using Kyocera.Microservice.Models.Models;

namespace Kyocera.Microservice.DbContext.BoundedContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public AppDbContext(Microsoft.EntityFrameworkCore.DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Incidencia> Incidencias { get; set; }
        public DbSet<Usuario> Usuarios { get; set; } // <--- DEBES AÑADIR ESTA LÍNEA
    }
}
