using Fixora.Microservice.Models.Models.Entities;

namespace Fixora.Microservice.Application.Services.Incidencias
{
    public interface IIncidenciasService
    {
        Task<IEnumerable<Incidencia>> GetAllAsync();
        Task<Incidencia?> GetByIdAsync(int id);
        Task<Incidencia> CreateAsync(Incidencia incidencia);
        Task<bool> UpdateAsync(int id, Incidencia incidencia);
        Task<bool> DeleteAsync(int id);
    }
}