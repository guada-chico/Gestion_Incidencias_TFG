using System;

namespace Kyocera.Microservice.Models.Models
{    public class Incidencia
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public Estado Estado { get; set; }
        public Estado Prioridad { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public DateTime? FechaLimite { get; set; }
    }
 
}
