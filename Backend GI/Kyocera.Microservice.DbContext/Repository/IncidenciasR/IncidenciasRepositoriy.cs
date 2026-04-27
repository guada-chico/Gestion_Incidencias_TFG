using Microsoft.EntityFrameworkCore;
using Fixora.Microservice.DbContext.BoundedContext;
using Fixora.Microservice.Models.Models.Entities;


namespace Fixora.Microservice.DbContext.Repository.Incidencias
{
    public class IncidenciasRepository : IIncidenciasRepository
    {
        private readonly AppDbContext _context;

        public IncidenciasRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Incidencia>> GetAllAsync()
        {
            return await _context.Incidencias.ToListAsync();
        }

        public async Task<Incidencia?> GetByIdAsync(int id)
        {
            return await _context.Incidencias.FindAsync(id);
        }

        public async Task<Incidencia> CreateAsync(Incidencia incidencia)
        {
            await _context.Incidencias.AddAsync(incidencia);
            await _context.SaveChangesAsync();
            return incidencia;
        }

        public async Task UpdateAsync(Incidencia incidencia)
        {
            _context.Incidencias.Update(incidencia);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var incidencia = await _context.Incidencias.FindAsync(id);

            if (incidencia != null)
            {
                _context.Incidencias.Remove(incidencia);
                await _context.SaveChangesAsync();
            }
        }
    }
}