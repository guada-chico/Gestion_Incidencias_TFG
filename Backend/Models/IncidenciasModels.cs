using System.ComponentModel.DataAnnotations;
using Gestion_Incidencias_v3.Models.Enums;

namespace Gestion_Incidencias_v3.Models
{
    public class IncidenciasModels
    {
           
        public int Id { get; set; }
        [Required(ErrorMessage = "El título es obligatorio")]
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public Estado Estado { get; set; }
        public Prioridad Prioridad { get; set; }
        public DateTime FechaCreacion { get; set; }
        public DateTime FechaActualizacion { get; set; }
        public DateTime? FechaLimite { get; set; } //DataTime con ? porque permite que el campo acepte valores nulos en la base de datos y en la API

    }
}
