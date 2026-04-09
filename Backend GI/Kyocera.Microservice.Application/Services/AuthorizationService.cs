using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Kyocera.Microservice.Application.Services
{
    public class AuthService : IAuthorizationService
    {
        public string? Authenticate(string usuario, string password)
        {
            if (usuario == "admin.kyocera" && password == "1234")
            {
                return GenerateToken(usuario);
            }
            return null;
        }

        public bool Register(string usuario, string password)
        {
            // Implementación simple: usar un diccionario estático para almacenar usuarios en memoria
            if (InMemoryUsers.Users.ContainsKey(usuario))
                return false;

            InMemoryUsers.Users.TryAdd(usuario, password);
            return true;
        }
        private string GenerateToken(string usuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("clave_super_secreta"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, usuario)
        };

            var token = new JwtSecurityToken(
                issuer: "tuApp",
                audience: "tuApp",
                claims: claims,
                expires: DateTime.Now.AddHours(1),
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
