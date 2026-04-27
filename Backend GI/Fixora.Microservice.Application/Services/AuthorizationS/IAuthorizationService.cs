using System.Security.Claims;

namespace Fixora.Microservice.Application.Services.Authorization
{
    public interface IAuthorizationService
    {
        string? Authenticate(string email, string password);
        bool Register(string email, string password);
        ClaimsPrincipal? ValidateToken(string token);
    }
}
