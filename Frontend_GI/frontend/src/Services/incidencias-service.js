// incidencias-service.js
import { API_BASE_URL, authHeader } from './api-config';

export const getIncidencias = async (filtros = {}) => {
    // Construir query string basada en IncidenciasFilter.cs
    const params = new URLSearchParams({
        Estado: filtros.estado || '',
        Prioridad: filtros.prioridad || '',
        Usuario: filtros.usuario || '',
        PageNumber: filtros.pageNumber || 1,
        PageSize: filtros.pageSize || 10
    });

    const response = await fetch(`${API_BASE_URL}/Incidencias?${params}`, {
        headers: { ...authHeader() }
    });

    if (response.status === 401) throw new Error('Sesión expirada');
    return await response.json(); // Retorna { PageNumber, TotalItems, Data, ... }
};

export const createIncidencia = async (incidencia) => {
    const response = await fetch(`${API_BASE_URL}/Incidencias`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...authHeader() 
        },
        body: JSON.stringify(incidencia) // Coincide con el modelo Incidencia
    });
    return await response.json();
};

export const updateIncidencia = async (id, incidencia) => {
    await fetch(`${API_BASE_URL}/Incidencias/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...authHeader() 
        },
        body: JSON.stringify({ ...incidencia, id }) // Asegura que el ID coincida
    });
};

export const deleteIncidencia = async (id) => {
    await fetch(`${API_BASE_URL}/Incidencias/${id}`, {
        method: 'DELETE',
        headers: { ...authHeader() }
    });
};