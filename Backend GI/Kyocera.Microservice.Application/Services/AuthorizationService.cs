using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Kyocera.Microservice.DbContext.Repository;
using Kyocera.Microservice.Models.Models;

namespace Kyocera.Microservice.Application.Services
{
    public class AuthService : IAuthorizationService
    {
        private const string SecretKey = "clave_super_secreta_256Bits!_OK12";
        private const string Issuer = "tuApp";
        private const string Audience = "tuApp";
        private readonly IUsuariosRepository _usuariosRepository;

        public AuthService(IUsuariosRepository usuariosRepository)
        {
            _usuariosRepository = usuariosRepository;
        }

        public string? Authenticate(string email, string password)
        {
            try
            {
                // Usuario hardcodeado para pruebas
                if (email == "admin@kyocera.com" && password == "1234")
                    return GenerateToken(email);

                // Buscar usuario en BD
                var usuarioEnBd = _usuariosRepository.GetByEmail(email);
                if (usuarioEnBd != null && VerifyPassword(password, usuarioEnBd.PasswordHash))
                    return GenerateToken(email);

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Authenticate: {ex.Message}");
                throw;
            }
        }

        public bool Register(string email, string password)
        {
            try
            {
                // Validar que el usuario no exista
                var usuarioExistente = _usuariosRepository.GetByEmail(email);
                if (usuarioExistente != null)
                    return false;

                // Crear nuevo usuario con contraseña hasheada
                var nuevoUsuario = new Usuario
                {
                    Email = email,
                    PasswordHash = HashPassword(password),
                    FechaCreacion = DateTime.UtcNow
                };

                _usuariosRepository.Add(nuevoUsuario);
                _usuariosRepository.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Register: {ex.Message}");
                throw;
            }
        }

        private string GenerateToken(string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, email),
                new Claim(ClaimTypes.Role, "Administrator")
            };

            var token = new JwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24), // 24 horas para testing
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string HashPassword(string password)
        {
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "salt_kyocera"));
                return Convert.ToBase64String(hash);
            }
        }

        private bool VerifyPassword(string password, string hash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == hash;
        }
    }
}