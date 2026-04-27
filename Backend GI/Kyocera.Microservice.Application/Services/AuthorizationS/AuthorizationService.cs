using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Kyocera.Microservice.Models.Models.Entities;
using Kyocera.Microservice.DbContext.Repository.Usuarios;

namespace Kyocera.Microservice.Application.Services.Authorization
{
    public class AuthService : IAuthorizationService
    {
        private const string SecretKey = "clave_super_secreta_256Bits!_OK12";
        private const string Issuer = "tuApp";
        private const string Audience = "tuApp";
        // Default admin accounts to ensure exist on startup
        private const string Admin1Email = "julia@fixora.com";
        private const string Admin2Email = "guada@fixora.com";
        // WARNING: default passwords - change in production
        private const string DefaultAdminPassword = "Admin123!";

        private readonly IUsuariosRepository _usuariosRepository;

        public AuthService(IUsuariosRepository usuariosRepository)
        {
            _usuariosRepository = usuariosRepository;
            // Ensure default admin users exist
            try
            {
                EnsureDefaultAdmins();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing default admins: {ex.Message}");
            }
        }

        // LOGIN
        public string? Authenticate(string email, string password)
        {
            try
            {
                var user = _usuariosRepository.GetByEmail(email);

                if (user == null)
                    return null;

                if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
                    return null;

                return GenerateToken(user);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Authenticate: {ex.Message}");
                throw;
            }
        }

        // REGISTER
        public bool Register(string email, string password)
        {
            try
            {
                var userExists = _usuariosRepository.GetByEmail(email);

                if (userExists != null)
                    return false;

                // Create secure password hash with per-user salt
                var (hash, salt) = CreatePasswordHash(password);

                var nuevoUsuario = new Usuario
                {
                    Email = email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    FechaCreacion = DateTime.UtcNow,
                    Role = "User"
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

        // JWT
        private string GenerateToken(Usuario user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(SecretKey));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Validate a JWT and return the principal if valid
        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = Issuer,
                    ValidateAudience = true,
                    ValidAudience = Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromSeconds(30)
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                return principal;
            }
            catch
            {
                return null;
            }
        }

        // Create a password hash and per-user salt using PBKDF2
        private (string hash, string salt) CreatePasswordHash(string password)
        {
            // 16 bytes salt
            var saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }

            var salt = Convert.ToBase64String(saltBytes);

            // derive 32-byte subkey
            using var deriveBytes = new Rfc2898DeriveBytes(password, saltBytes, 100_000, HashAlgorithmName.SHA256);
            var hashBytes = deriveBytes.GetBytes(32);
            var hash = Convert.ToBase64String(hashBytes);

            return (hash, salt);
        }

        // Verify password using stored hash and salt
        private bool VerifyPassword(string password, string storedHash, string? storedSalt)
        {
            if (string.IsNullOrEmpty(storedSalt) || string.IsNullOrEmpty(storedHash))
                return false;

            var saltBytes = Convert.FromBase64String(storedSalt);
            using var deriveBytes = new Rfc2898DeriveBytes(password, saltBytes, 100_000, HashAlgorithmName.SHA256);
            var hashBytes = deriveBytes.GetBytes(32);
            var computedHash = Convert.ToBase64String(hashBytes);

            return computedHash == storedHash;
        }

        // Ensure the two default admin users exist
        private void EnsureDefaultAdmins()
        {
            var admin1 = _usuariosRepository.GetByEmail(Admin1Email);
            if (admin1 == null)
            {
                var (hash, salt) = CreatePasswordHash(DefaultAdminPassword);
                var u = new Usuario
                {
                    Email = Admin1Email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    FechaCreacion = DateTime.UtcNow,
                    Role = "Admin"
                };
                _usuariosRepository.Add(u);
            }

            var admin2 = _usuariosRepository.GetByEmail(Admin2Email);
            if (admin2 == null)
            {
                var (hash, salt) = CreatePasswordHash(DefaultAdminPassword);
                var u = new Usuario
                {
                    Email = Admin2Email,
                    PasswordHash = hash,
                    PasswordSalt = salt,
                    FechaCreacion = DateTime.UtcNow,
                    Role = "Admin"
                };
                _usuariosRepository.Add(u);
            }

            // Persist if any were added
            _usuariosRepository.SaveChanges();
        }
    }
}