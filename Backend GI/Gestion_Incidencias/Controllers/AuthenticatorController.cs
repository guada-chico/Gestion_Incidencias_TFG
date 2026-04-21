using Microsoft.AspNetCore.Mvc;

using AuthSvc = Kyocera.Microservice.Application.Services.Authorization.IAuthorizationService;

[ApiController]
[Route("api/[controller]")]
public class AuthenticatorController : ControllerBase
{
    private readonly AuthSvc _authService;

    public AuthenticatorController(AuthSvc authService)
    {
        _authService = authService;
    }

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
            Console.WriteLine($"Error en Login: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            return StatusCode(500, new { message = "Error interno en login", detail = ex.Message });
        }
    }

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
            Console.WriteLine($"Error en Register: {ex.Message}");
            Console.WriteLine($"StackTrace: {ex.StackTrace}");
            return StatusCode(500, new { message = "Error interno en register", detail = ex.Message });
        }
    }
}