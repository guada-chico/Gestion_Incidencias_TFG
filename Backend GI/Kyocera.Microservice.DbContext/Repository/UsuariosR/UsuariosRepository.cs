using System.Collections.Generic;
using System.Linq;
using Kyocera.Microservice.DbContext.BoundedContext;
using Kyocera.Microservice.Models.Models.Entities;

namespace Kyocera.Microservice.DbContext.Repository.Usuarios
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly AppDbContext _context;

        public UsuariosRepository(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Usuario> GetAll()
        {
            return _context.Usuarios.ToList();
        }

        public Usuario? GetByEmail(string email)
        {
            return _context.Usuarios.FirstOrDefault(u => u.Email == email);
        }

        public void Add(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
