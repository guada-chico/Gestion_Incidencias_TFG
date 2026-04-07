using Gestion_Incidencias_v3.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Gestion_Incidencias_v3.Repositories
{
    public interface IIncidenciasRepository
    {
        Task<IEnumerable<IncidenciasModels>> GetAllAsync();
        Task<IncidenciasModels?> GetByIdAsync(int id);
        Task<IncidenciasModels> CreateAsync(IncidenciasModels incidencia);
        Task<bool> UpdateAsync(IncidenciasModels incidencia);
        Task<bool> DeleteAsync(int id);
    }
}
