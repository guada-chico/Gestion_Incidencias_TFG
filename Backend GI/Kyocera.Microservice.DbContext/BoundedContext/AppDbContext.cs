using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Kyocera.Microservice.Models.Models;

namespace Kyocera.Microservice.DbContext.BoundedContext
{
    internal class AppDbContext  : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<GestionIncidenciasDB> Incidencias { get; set; } //GestionIncidenciasDB -> BD ?? ; Incidencias -> Tabla
    }
}
}
