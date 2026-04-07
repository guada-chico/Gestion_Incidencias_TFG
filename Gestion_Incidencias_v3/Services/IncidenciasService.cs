using Gestion_Incidencias_v3.BoundedContext;
using Gestion_Incidencias_v3.Models;
using Microsoft.EntityFrameworkCore;

namespace Gestion_Incidencias_v3.Services
{
    public class IncidenciasService : IIncidenciasService
    {
        private readonly AppDbContext _context;

        public IncidenciasService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<IncidenciasModels>> GetAllAsync()
        {
            return await _context.Incidencias3.ToListAsync();
        }

        public async Task<IncidenciasModels?> GetByIdAsync(int id)
        {
            return await _context.Incidencias3.FindAsync(id);
        }

        public async Task<IncidenciasModels> CreateAsync(IncidenciasModels incidencia)
        {
            incidencia.FechaCreacion = DateTime.Now;
            incidencia.FechaActualizacion = DateTime.Now;

            _context.Incidencias3.Add(incidencia);
            await _context.SaveChangesAsync();

            return incidencia;
        }

        public async Task<bool> UpdateAsync(int id, IncidenciasModels incidencia)
        {
            if (id != incidencia.Id)
                return false;

            var existing = await _context.Incidencias3.FindAsync(id);

            if (existing == null)
                return false;

            existing.Titulo = incidencia.Titulo;
            existing.Descripcion = incidencia.Descripcion;
            existing.Estado = incidencia.Estado;
            existing.Prioridad = incidencia.Prioridad;
            existing.FechaLimite = incidencia.FechaLimite;
            existing.FechaActualizacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var incidencia = await _context.Incidencias3.FindAsync(id);

            if (incidencia == null)
                return false;

            _context.Incidencias3.Remove(incidencia);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}