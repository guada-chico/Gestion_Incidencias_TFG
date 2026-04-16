using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kyocera.Microservice.Application.Services
{
    public interface IAuthorizationService
    {
      string? Authenticate(string email, string password);
      bool Register(string email, string password);
    }
}
