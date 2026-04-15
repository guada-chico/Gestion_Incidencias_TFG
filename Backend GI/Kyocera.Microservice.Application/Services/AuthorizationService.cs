using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Kyocera.Microservice.Application.Services
{
    public class AuthService : IAuthorizationService
    {
        private const string SecretKey = "clave_super_secreta_256Bits!_OK12";
        private const string Issuer = "tuApp";
        private const string Audience = "tuApp";

        public string? Authenticate(string usuario, string password)
        {
            try
            {
                // Usuario hardcodeado
                if (usuario == "admin.kyocera" && password == "1234")
                    return GenerateToken(usuario);

                // Usuarios registrados en memoria
                if (InMemoryUsers.Users.TryGetValue(usuario, out var storedPassword)
                    && storedPassword == password)
                    return GenerateToken(usuario);

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Authenticate: {ex.Message}");
                throw; // lo relanza para que el controller lo capture
            }
        }

        public bool Register(string usuario, string password)
        {
            try
            {
                if (InMemoryUsers.Users.ContainsKey(usuario))
                    return false;

                InMemoryUsers.Users.TryAdd(usuario, password);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Register: {ex.Message}");
                throw;
            }
        }

        private string GenerateToken(string usuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("clave_super_secreta_256Bits!_OK12"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario),
                new Claim(ClaimTypes.Role, "Administrator")
            };

            var token = new JwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // UtcNow en vez de Now
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    internal static class InMemoryUsers
    {
        public static readonly System.Collections.Concurrent.ConcurrentDictionary<string, string> Users =
            new System.Collections.Concurrent.ConcurrentDictionary<string, string>();
    }
}