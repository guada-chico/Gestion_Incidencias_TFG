using Fixora.Microservice.DbContext.Repository.Incidencias;
using Fixora.Microservice.Models.Models.Entities;
using Fixora.Microservice.Models.Models.Filters;
using Fixora.Microservice.DbContext.Repository.Incidencias;
using Fixora.Microservice.Models.Models.Entities;
using Fixora.Microservice.Models.Models.Filters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Fixora.Microservice.Controllers
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
            // Obtener el usuario y su rol desde el token
            var userEmail = User.Identity?.Name;
            var isAdmin = User.IsInRole("Admin");

            // Obtener todas las incidencias base
            var query = (await _repository.GetAllAsync()).AsQueryable();

            // REGLA DE NEGOCIO: Si no es Admin, filtrar para que solo vea sus propias incidencias
            if (!isAdmin)
            {
                query = query.Where(i => i.UsuarioCreador == userEmail);
            }

            // Aplicar filtros adicionales (Estado, Prioridad, Id)
            if (!string.IsNullOrEmpty(filter.Estado) && Enum.TryParse<Estado>(filter.Estado, true, out var estadoEnum))
            {
                query = query.Where(i => i.Estado == estadoEnum);
            }

            if (!string.IsNullOrEmpty(filter.Prioridad) && Enum.TryParse<Prioridad>(filter.Prioridad, true, out var prioridadEnum))
            {
                query = query.Where(i => i.Prioridad == prioridadEnum);
            }

            if (filter.Id.HasValue && filter.Id > 0)
            {
                query = query.Where(i => i.Id == filter.Id.Value);
            }

            // Paginación
            if (filter.PageNumber <= 0) filter.PageNumber = 1;
            if (filter.PageSize <= 0) filter.PageSize = 100;

            var totalItems = query.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize);

            var resultados = query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

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

            // Verificar que un usuario normal no intente acceder a una incidencia ajena por ID
            if (!User.IsInRole("Admin") && incidencia.UsuarioCreador != User.Identity?.Name)
            {
                return Forbid();
            }

            return Ok(incidencia);
        }

        [HttpPost]
        public async Task<ActionResult<Incidencia>> Create(Incidencia incidencia)
        {
            // Asignar metadatos automáticamente
            incidencia.FechaCreacion = DateTime.UtcNow;
            incidencia.UsuarioCreador = User.Identity?.Name; // Registrar quién la crea

            // Un usuario normal no puede asignarse alguien al crearla
            if (!User.IsInRole("Admin"))
            {
                incidencia.UsuarioAsignado = null;
            }

            var created = await _repository.CreateAsync(incidencia);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Incidencia incidencia)
        {
            if (id != incidencia.Id)
                return BadRequest();

            var existing = await _repository.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            var isAdmin = User.IsInRole("Admin");

            // Verificar permisos: Solo el creador o un Admin pueden editar
            if (!isAdmin && existing.UsuarioCreador != User.Identity?.Name)
            {
                return Forbid();
            }

            // Actualizar propiedades comunes
            existing.Titulo = incidencia.Titulo;
            existing.Descripcion = incidencia.Descripcion;
            existing.Estado = incidencia.Estado;
            existing.Prioridad = incidencia.Prioridad;
            existing.FechaLimite = incidencia.FechaLimite;
            existing.ComentariosJson = incidencia.ComentariosJson;

            // REGLA DE NEGOCIO: Solo el Admin puede modificar el usuario asignado
            if (isAdmin)
            {
                existing.UsuarioAsignado = incidencia.UsuarioAsignado;
            }

            await _repository.UpdateAsync(existing);

            return Ok(existing);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Solo los administradores pueden borrar incidencias
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