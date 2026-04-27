using System.Collections.Generic;
using Fixora.Microservice.Models.Models.Entities;

namespace Fixora.Microservice.DbContext.Repository.Usuarios
{
    public interface IUsuariosRepository
    {
        IEnumerable<Usuario> GetAll();
        Usuario? GetByEmail(string email);
        void Add(Usuario usuario);
        void SaveChanges();
    }
}
