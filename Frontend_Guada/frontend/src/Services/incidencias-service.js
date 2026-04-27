import { API_BASE_URL, authHeader } from './api-config';

// OBTENER UNA SOLA (Esta es la que faltaba y causaba el error)
export const getIncidenciaById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/Incidencias/${id}`, {
        headers: { ...authHeader() }
    });

    if (response.status === 401) throw new Error('Sesión expirada');
    if (!response.ok) throw new Error('No se pudo cargar la incidencia');
    return await response.json();
};

export const getIncidencias = async (filtros = {}) => {
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
    return await response.json();
};

export const createIncidencia = async (incidencia) => {
    const response = await fetch(`${API_BASE_URL}/Incidencias`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...authHeader() 
        },
        body: JSON.stringify(incidencia)
    });
    return await response.json();
};

export const updateIncidencia = async (id, incidencia) => {
    const response = await fetch(`${API_BASE_URL}/Incidencias/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            ...authHeader() 
        },
        body: JSON.stringify(incidencia)
    });
    
    if (response.status === 204 || response.status === 200) {
        return response.status === 200 ? await response.json() : null;
    }
    
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || 'Error al actualizar');
};

export const getUsuarios = async () => {
    const response = await fetch(`${API_BASE_URL}/Usuarios`, {
        headers: { ...authHeader() }
    });

    if (response.status === 401) throw new Error('Sesión expirada');
    return await response.json();
};

export const deleteIncidencia = async (id) => {
    const response = await fetch(`${API_BASE_URL}/Incidencias/${id}`, {
        method: 'DELETE',
        headers: { ...authHeader() }
    });
    if (!response.ok) throw new Error('Error al eliminar');
};