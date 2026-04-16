using Kyocera.Microservice.Models.Models;

namespace Kyocera.Microservice.DbContext.Repository
{
    public interface IUsuariosRepository
    {
        Usuario? GetByEmail(string email);
        void Add(Usuario usuario);
        void SaveChanges();
    }
}
