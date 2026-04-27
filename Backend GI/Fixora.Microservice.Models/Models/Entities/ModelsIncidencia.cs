using System;

namespace Fixora.Microservice.Models.Models.Entities
{    public class Incidencia
    {
        public int Id { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public Estado Estado { get; set; }
        public Prioridad Prioridad { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public DateTime? FechaLimite { get; set; }
        public string? UsuarioAsignado { get; set; }
        public string? UsuarioCreador { get; set; }
        public string? ComentariosJson { get; set; }
    }
 
}
