// auth-service.js
import { API_BASE_URL, saveToken, removeToken } from './api-config.js';

export const login = async (usuario, password) => {
    const response = await fetch(`${API_BASE_URL}/Authenticator/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }) // Coincide con LoginRequest.cs
    });

    if (!response.ok) throw new Error('Credenciales incorrectas');

    const data = await response.json();
    saveToken(data.token); // Guarda el JWT generado por el backend
    return data;
};

export const register = async (usuario, password) => {
    const response = await fetch(`${API_BASE_URL}/Authenticator/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
    });
    return await response.text();
};

export const logout = () => removeToken();