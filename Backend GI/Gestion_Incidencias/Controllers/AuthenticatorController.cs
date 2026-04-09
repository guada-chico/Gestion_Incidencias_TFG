using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Kyocera.Microservice.Models;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
 
        if (request.Usuario == "admin.kyocera" && request.Password == "1234")
        {
            var token = GenerateToken(request.Usuario);
            return Ok(new { token });
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginRequest request)
    {
       
        if (request.Usuario == "admin.kyocera")
            return BadRequest("El usuario ya existe");

        return Ok("Usuario registrado correctamente");
    }

    // Generate a signed JWT token for the authenticated user
    private string GenerateToken(string usuario)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("mi_clave_secreta_1234567890");

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario),
            new Claim(ClaimTypes.Role, "Administrator")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

}