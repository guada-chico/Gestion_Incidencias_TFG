using System.Collections.Generic;
using System.Threading.Tasks;
using Fixora.Microservice.Models.Models.Entities;

namespace Fixora.Microservice.DbContext.Repository.Incidencias
{
    public interface IIncidenciasRepository
    {
        Task<IEnumerable<Incidencia>> GetAllAsync();
        Task<Incidencia?> GetByIdAsync(int id);
        Task<Incidencia> CreateAsync(Incidencia incidencia);
        Task UpdateAsync(Incidencia incidencia);
        Task DeleteAsync(int id);
    }
}
