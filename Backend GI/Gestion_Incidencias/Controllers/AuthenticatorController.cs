using Microsoft.AspNetCore.Mvc;
using Kyocera.Microservice.Application.Services.Authorization;

[ApiController]
[Route("api/[controller]")]
public class AuthenticatorController : ControllerBase
{
    private readonly IAuthorizationService _authService;

    public AuthenticatorController(IAuthorizationService authService)
    {
        _authService = authService;
    }

    // LOGIN
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            if (request == null)
                return BadRequest("El cuerpo de la petición no puede estar vacío");

            var token = _authService.Authenticate(request.Email, request.Password);

            if (token == null)
                return Unauthorized(new { message = "Credenciales incorrectas" });

            return Ok(new { token });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ ERROR LOGIN: {ex.Message}");
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new
            {
                message = "Error interno en login",
                error = ex.Message
            });
        }
    }

    //  REGISTER
    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginRequest request)
    {
        try
        {
            if (request == null)
                return BadRequest("El cuerpo de la petición no puede estar vacío");

            var success = _authService.Register(request.Email, request.Password);

            if (!success)
                return BadRequest(new { message = "El usuario ya existe" });

            return Ok(new { message = "Usuario registrado correctamente" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ ERROR REGISTER: {ex.Message}");
            Console.WriteLine(ex.StackTrace);

            return StatusCode(500, new
            {
                message = "Error interno en register",
                error = ex.Message
            });
        }
    }
}