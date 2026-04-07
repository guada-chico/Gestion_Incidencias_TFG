using Gestion_Incidencias_v3.Models;

namespace Gestion_Incidencias_v3.Services
{
    public interface IIncidenciasService
    {
        Task<IEnumerable<IncidenciasModels>> GetAllAsync();
        Task<IncidenciasModels?> GetByIdAsync(int id);
        Task<IncidenciasModels> CreateAsync(IncidenciasModels incidencia);
        Task<bool> UpdateAsync(int id, IncidenciasModels incidencia);
        Task<bool> DeleteAsync(int id);
    }
}