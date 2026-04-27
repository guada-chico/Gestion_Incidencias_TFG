namespace Kyocera.Microservice.Models.Models.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        // Optional per-user salt for PBKDF2 password hashing
        public string? PasswordSalt { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public string Role { get; set; } = "User";
    }
}
