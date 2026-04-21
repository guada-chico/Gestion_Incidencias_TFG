using System.Collections.Generic;
using Kyocera.Microservice.Models.Models.Entities;

namespace Kyocera.Microservice.DbContext.Repository.Usuarios
{
    public interface IUsuariosRepository
    {
        IEnumerable<Usuario> GetAll();
        Usuario? GetByEmail(string email);
        void Add(Usuario usuario);
        void SaveChanges();
    }
}
