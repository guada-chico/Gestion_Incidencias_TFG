using Kyocera.Microservice.Models.Models;
using Kyocera.Microservice.WebAPI.Interface;
using Microsoft.AspNetCore.Mvc;


namespace Gestion_Incidencias_v3.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncidenciasController : ControllerBase
{
    private readonly IInterfaz _service;

    public IncidenciasController(IInterfaz service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Incidencia>>> Get()
    {
        return Ok(await _service.ObtenerTodas());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Incidencia>> Get(int id)
    {
        var inc = await _service.ObtenerPorId(id);
        return inc == null ? NotFound() : Ok(inc);
    }

    [HttpPost]
    public async Task<ActionResult> Post(Incidencia inc)
    {
        await _service.Crear(inc);
        return CreatedAtAction(nameof(Get), new { id = inc.Id }, inc);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, Incidencia inc)
    {
        if (id != inc.Id) return BadRequest();
        await _service.Actualizar(inc);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _service.Eliminar(id);
        return NoContent();
    }
}