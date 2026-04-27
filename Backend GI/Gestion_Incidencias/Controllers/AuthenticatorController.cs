using Microsoft.AspNetCore.Mvc;
using Fixora.Microservice.Application.Services.Authorization;
using Fixora.Microservice.Models.Models.Entities;
using System;

namespace Fixora.Microservice.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticatorController : ControllerBase
    {
        private readonly IAuthorizationService _authService;

        public AuthenticatorController(IAuthorizationService authService)
        {
            _authService = authService;
        }

        // LOGIN: Genera el token que contiene el Rol y el Email del usuario
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest("El cuerpo de la petición no puede estar vacío");

                // El servicio debe devolver un token que incluya ClaimTypes.Name y ClaimTypes.Role
                var token = _authService.Authenticate(request.Email, request.Password);

                if (token == null)
                    return Unauthorized(new { message = "Credenciales incorrectas" });

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR LOGIN: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error interno en el servidor durante el inicio de sesión",
                    error = ex.Message
                });
            }
        }

        // REGISTER: Crea un nuevo usuario (por defecto con rol "User")
        [HttpPost("register")]
        public IActionResult Register([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest("El cuerpo de la petición no puede estar vacío");

                var success = _authService.Register(request.Email, request.Password);

                if (!success)
                    return BadRequest(new { message = "El usuario ya existe o los datos son inválidos" });

                return Ok(new { message = "Usuario registrado correctamente" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR REGISTER: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error interno en el servidor durante el registro",
                    error = ex.Message
                });
            }
        }
    }
}