using Kyocera.Microservice.DbContext.Repository.Usuarios;
using Kyocera.Microservice.Models.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Kyocera.Microservice.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosRepository _repository;

        public UsuariosController(IUsuariosRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Usuario>> GetAll()
        {
            var usuarios = _repository.GetAll();
            return Ok(usuarios);
        }
    }
}
