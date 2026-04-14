using Kyocera.Microservice.Application.Interfaces;
using Kyocera.Microservice.Application.Services;
using Kyocera.Microservice.DbContext.BoundedContext;
using Kyocera.Microservice.DbContext.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using AuthSvc = Kyocera.Microservice.Application.Services.IAuthorizationService;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la conexión a SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Registro del Repositorio
builder.Services.AddScoped<IIncidenciasRepository, IncidenciasRepository>();

//3. Registro del servicio 
builder.Services.AddScoped<AuthSvc, AuthService>();
builder.Services.AddScoped<IIncidenciasService, IncidenciasService>();

//4. Configuracion token 
var key = Encoding.UTF8.GetBytes("clave_super_secreta");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "tuApp",
        ValidAudience = "tuApp",
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

//Autorizacion
builder.Services.AddAuthorization();

//Configuracion CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("NgrokPolicy", policy =>
    {
        policy.AllowAnyOrigin() // O pon tu URL de ngrok específica
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Después de app.UseHttpsRedirection()
app.UseCors("NgrokPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();



