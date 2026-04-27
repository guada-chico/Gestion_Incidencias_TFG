using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fixora.Microservice.DbContext.Repository.Incidencias;
using Fixora.Microservice.Models.Models.Entities;

namespace Fixora.Microservice.Application.Services.Incidencias
{
    public class IncidenciasService : IIncidenciasService
    {
        private readonly IIncidenciasRepository _repository;

        public IncidenciasService(IIncidenciasRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Incidencia>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Incidencia?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Incidencia> CreateAsync(Incidencia incidencia)
        {
            incidencia.FechaCreacion = DateTime.UtcNow;

            return await _repository.CreateAsync(incidencia);
        }

        public async Task<bool> UpdateAsync(int id, Incidencia incidencia)
        {
            var existente = await _repository.GetByIdAsync(id);

            if (existente == null)
                return false;

            existente.Titulo = incidencia.Titulo;
            existente.Descripcion = incidencia.Descripcion;
            existente.Estado = incidencia.Estado;
            existente.Prioridad = incidencia.Prioridad;

            await _repository.UpdateAsync(existente);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existe = await _repository.GetByIdAsync(id);

            if (existe == null)
                return false;

            await _repository.DeleteAsync(id);
            return true;
        }
    }
}