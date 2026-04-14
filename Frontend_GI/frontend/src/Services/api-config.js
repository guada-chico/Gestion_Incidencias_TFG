// api-config.js
const API_BASE_URL = 'http://localhost:5150/api'; // Puerto definido en launchSettings.json

export const authHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'ngrok-skip-browser-warning': 'true' // Salta la pantalla de advertencia para peticiones API
    };
};

export const saveToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');