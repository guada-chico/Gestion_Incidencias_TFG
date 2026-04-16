// auth-service.js
import { API_BASE_URL, saveToken, removeToken } from "./api-config";

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/Authenticator/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password })
    });

    if (!response.ok) throw new Error('Credenciales incorrectas');

    const data = await response.json();
    saveToken(data.token); // Guarda el JWT generado por el backend
    return data;
};

export const register = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/Authenticator/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password })
    });
    return await response.text();
};

export const logout = () => removeToken();