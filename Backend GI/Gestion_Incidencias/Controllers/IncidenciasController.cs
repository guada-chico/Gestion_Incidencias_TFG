using Kyocera.Microservice.DbContext.Repository;
using Kyocera.Microservice.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kyocera.Microservice.Controllers  
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IncidenciasController : ControllerBase
    {
        private readonly IIncidenciasRepository _repository;

        public IncidenciasController(IIncidenciasRepository repository)
        {
            _repository = repository;
        }


    [HttpGet]
    public async Task<ActionResult<object>> GetAll([FromQuery] IncidenciasFilter filter)
        {
            // Obtener todas las incidencias como IQueryable para poder filtrar y paginar
            var incidencias = (await _repository.GetAllAsync()).AsQueryable();

            // Aplicar filtros
            if (!string.IsNullOrEmpty(filter.Estado))
            {
                if (Enum.TryParse<Estado>(filter.Estado, true, out var estadoEnum))
                {
                    incidencias = incidencias.Where(i => i.Estado == estadoEnum);
                }
            }

            if (!string.IsNullOrEmpty(filter.Prioridad))
            {
                if (Enum.TryParse<Prioridad>(filter.Prioridad, true, out var prioridadEnum))
                {
                    incidencias = incidencias.Where(i => i.Prioridad == prioridadEnum);
                }
            }

            if (filter.Id.HasValue && filter.Id > 0)
            {
                incidencias = incidencias.Where(i => i.Id == filter.Id.Value);
            }

            // Paginación: asegurar valores por defecto válidos
            if (filter.PageNumber <= 0) filter.PageNumber = 1;
            if (filter.PageSize <= 0) filter.PageSize = 100; // Aumentado a 100 para obtener más resultados por defecto

            var totalItems = incidencias.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize);

            var resultados = incidencias
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            // Respuesta con paginaci�n
            var response = new
            {
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalItems = totalItems,
                TotalPages = totalPages,
                Data = resultados
            };

            return Ok(response);
        }

      
    [HttpGet("{id}")]
    public async Task<ActionResult<Incidencia>> GetById(int id)
        {
         var incidencia = await _repository.GetByIdAsync(id);

         if (incidencia == null)
             return NotFound();

            return Ok(incidencia);
        }


    [HttpPost]
    public async Task<ActionResult<Incidencia>> Create(Incidencia incidencia)
        {
         incidencia.FechaCreacion = DateTime.Now;

            var created = await _repository.CreateAsync(incidencia);

            return CreatedAtAction(nameof(GetById), new { id = incidencia.Id }, incidencia);
        }

       
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Incidencia incidencia)
       {
           if (id != incidencia.Id)
                return BadRequest();

            var existing = await _repository.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            // Actualizar propiedades
            existing.Titulo = incidencia.Titulo;
            existing.Descripcion = incidencia.Descripcion;
            existing.Estado = incidencia.Estado;
            existing.Prioridad = incidencia.Prioridad;
            existing.FechaLimite = incidencia.FechaLimite;
            existing.UsuarioAsignado = incidencia.UsuarioAsignado;
  

          await _repository.UpdateAsync(existing); 

          return NoContent();
        }

        
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
        {
          var incidencia = await _repository.GetByIdAsync(id);

          if (incidencia == null)
               return NotFound();

           await _repository.DeleteAsync(id);

           return NoContent();
        }
    }
}