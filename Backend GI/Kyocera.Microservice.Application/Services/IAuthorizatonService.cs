using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kyocera.Microservice.Application.Services
{
    public interface IAuthorizationService
    {
      string? Authenticate(string usuario, string password);
      bool Register(string usuario, string password);
    }
}
