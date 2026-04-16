using Kyocera.Microservice.DbContext.BoundedContext;
using Kyocera.Microservice.Models.Models;

namespace Kyocera.Microservice.DbContext.Repository
{
    public class UsuariosRepository : IUsuariosRepository
    {
        private readonly AppDbContext _context;

        public UsuariosRepository(AppDbContext context)
        {
            _context = context;
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
