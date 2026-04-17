// api-config.js
export const API_BASE_URL = 'https://localhost:7220/api'; 

// Constante: 24 horas en milisegundos
const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000;

export const saveToken = (token) => {
    const tokenData = {
        token: token,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('tokenData', JSON.stringify(tokenData));
};

export const removeToken = () => {
    localStorage.removeItem('tokenData');
    localStorage.removeItem('token'); // Backward compatibility
};

export const getValidToken = () => {
    const tokenDataStr = localStorage.getItem('tokenData');
    
    if (!tokenDataStr) return null;
    
    try {
        const tokenData = JSON.parse(tokenDataStr);
        const now = new Date().getTime();
        const elapsed = now - tokenData.timestamp;
        
        // Si han pasado más de 24 horas, eliminar el token
        if (elapsed > TOKEN_EXPIRY_TIME) {
            removeToken();
            return null;
        }
        
        return tokenData.token;
    } catch (error) {
        removeToken();
        return null;
    }
};

export const authHeader = () => {
    const token = getValidToken();
    return {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };
};

