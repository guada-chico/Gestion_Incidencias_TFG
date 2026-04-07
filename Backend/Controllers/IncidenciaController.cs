using Gestion_Incidencias_v3.Models;
using Gestion_Incidencias_v3.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Gestion_Incidencias_v3.Controllers
{
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
        public async Task<ActionResult<IEnumerable<IncidenciasModels>>> GetAll()
        {
            return Ok(await _repository.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IncidenciasModels>> GetById(int id)
        {
            var incidencia = await _repository.GetByIdAsync(id);

            if (incidencia == null)
                return NotFound();

            return incidencia;
        }

        [HttpPost]
        public async Task<ActionResult<IncidenciasModels>> Create(IncidenciasModels incidencia)
        {
            incidencia.FechaCreacion = DateTime.Now;
            incidencia.FechaActualizacion = DateTime.Now;

            var created = await _repository.CreateAsync(incidencia);

            return CreatedAtAction(nameof(GetById), new { id = incidencia.Id }, incidencia);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>Update(int id, IncidenciasModels incidencia)
        {
            if (id != incidencia.Id)
                return BadRequest();

            var existing = await _repository.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            existing.Titulo = incidencia.Titulo;
            existing.Descripcion = incidencia.Descripcion;
            existing.Estado = incidencia.Estado;
            existing.Prioridad = incidencia.Prioridad;
            existing.FechaLimite = incidencia.FechaLimite;
            existing.FechaActualizacion = DateTime.Now;

            incidencia.FechaActualizacion = DateTime.Now;
            await _repository.UpdateAsync(incidencia);

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
