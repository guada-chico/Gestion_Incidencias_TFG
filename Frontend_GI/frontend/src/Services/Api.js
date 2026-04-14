// api-config.js
const API_BASE_URL = 'https://delighted-pamperer-mutilated.ngrok-free.dev'; // Puerto definido en launchSettings.json

export const authHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const saveToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');