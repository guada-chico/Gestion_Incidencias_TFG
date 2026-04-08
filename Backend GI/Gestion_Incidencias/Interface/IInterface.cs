using Kyocera.Microservice.Models.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Kyocera.Microservice.DbContext.BoundedContext;    

namespace Kyocera.Microservice.WebAPI.Interface
{
    public interface IInterface
    {
        Task<List<GestionIncidenciasDB>> GetAllAsync();
        Task<GestionIncidenciasDB> GetByIdAsync(int id);
        Task CreateAsync(GestionIncidenciasDB incidencia);
        Task UpdateAsync(GestionIncidenciasDB incidencia);
        Task DeleteAsync(int id);

    }
}
