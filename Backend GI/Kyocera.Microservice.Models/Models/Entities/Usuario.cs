namespace Kyocera.Microservice.Models.Models.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}
