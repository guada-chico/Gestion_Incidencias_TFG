using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fixora.Microservice.Models.Models.Filters
{
    public class IncidenciasFilter
    {
        public int? Id { get; set; }
        public string? Estado { get; set; }      // Filtrar por estado (ejemplo: "Abierta")
        public string? Prioridad { get; set; }   // Filtrar por prioridad (ejemplo: "Alta")
        public string? Usuario { get; set; }     // Filtrar por usuario asignado

    }
}
